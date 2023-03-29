const bookModel = require("../models/book");
const borrowedBookModel = require("../models/borrowed_book");
const {handleErrorRes} = require("../config/error-handler");
const sequelize = require('sequelize')

/**
 * - Check the book
 *    - [ ]  Shows all existing books and quantities
 *    - [ ]  Books that are being borrowed are not counted
 */


bookModel.hasMany(borrowedBookModel, { as: 'borrowed_books', foreignKey: "bookCode" });

exports.get_all = async (req, res) => {
    /* #swagger.tags = ['Book']
       #swagger.description = 'Endpoint to get all books.' */

    /* #swagger.responses[200] = {
               schema: { $ref: "#/definitions/ResponseBooks" },
               description: 'Success'
       } */
    /* #swagger.responses[500] = {
               schema: { $ref: "#/definitions/InternalError" },
               description: 'Internal server error'
       } */
    try {

        const books = await bookModel.findAll({
            attributes: {
                include: [[sequelize.fn('COUNT', sequelize.col('bookCode')), 'borrowedBooksCount']]
            },
            include: [{
                model: borrowedBookModel,
                as: 'borrowed_books',
                attributes: [],
            }],
            group: ['code']
        });
        //subtract borrowed books from total books
        books.forEach(book => {
            book.dataValues.stock = book.dataValues.stock - book.dataValues.borrowedBooksCount;
            delete book.dataValues.borrowedBooksCount;
        });
        res.status(200).json({
            code: "200",
            status: "OK",
            data: books,
        });
    } catch (e) {
        handleErrorRes(res, e);
    }
};

exports.get_by_id = async (req, res) => {
    /* #swagger.tags = ['Book']
         #swagger.description = 'Endpoint to get a book by id.' */

    /* #swagger.responses[200] = {
                schema: { $ref: "#/definitions/ResponseBook" },
                description: 'Success'
        } */
    /* #swagger.responses[404] = {
                schema: { $ref: "#/definitions/NotFoundError" },
                description: 'Data not found'
        } */
    /* #swagger.responses[500] = {
                schema: { $ref: "#/definitions/InternalError" },
                description: 'Internal server error'
        }
     */
    try {
        const Item = await bookModel.findByPk(req.params.bookCode);
        if (Item) {
            const borrowedCount = await borrowedBookModel.count({
                where: {
                    bookCode: req.params.bookCode
                }
            });
            Item.dataValues.stock = Item.dataValues.stock - borrowedCount;
            res.status(200).json({
                code: "200",
                status: "OK",
                data: Item,
            });
        } else {
            res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                error: {
                    message: "Data not found!",
                },
            });
        }
    } catch (e) {
        handleErrorRes(res, e);
    }
};

exports.create = async (req, res) => {
    /*
    #swagger.tags = ['Book']
    #swagger.description = 'Endpoint to create a book.'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: "#/definitions/Book"
                }
            }
        }
    }



    #swagger.responses[201] = {
                    schema: { $ref: "#/definitions/ResponseBook" },
                    description: 'Success'
    }

    #swagger.responses[400] = {
             schema: { $ref: "#/definitions/Error" },
             description: 'Bad request'
     }

    #swagger.responses[500] = {
             schema: { $ref: "#/definitions/InternalError" },
             description: 'Internal server error'
    }
    */
    try {

        const data = {
            code: req.body.code,
            title: req.body.title,
            author: req.body.author,
            stock: req.body.stock,
        };
        if (!data.code || !data.title || !data.author || !data.stock) {
            throw new TypeError("Missing required fields!");
        }
        const result = await bookModel.create(data);
        if (result) {
            res.status(201).json({
                code: "201",
                status: "CREATED",
                data: result,
            });
        } else {
            throw new Error("Failed to create data!");
        }

    } catch (e) {
        handleErrorRes(res, e);
    }
};

exports.update = async (req, res) => {
    /*
    #swagger.tags = ['Book']
    #swagger.description = 'Endpoint to update a book.'

    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: "#/definitions/Book"
                }
            }
        }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/ResponseBook" },
        description: 'Success'
    }

    #swagger.responses[400] = {
        schema: { $ref: "#/definitions/Error" },
        description: 'Bad request'
    }

    #swagger.responses[404] = {
        schema: { $ref: "#/definitions/NotFoundError" },
        description: 'Data not found'
    }

    #swagger.responses[500] = {
        schema: { $ref: "#/definitions/InternalError" },
        description: 'Internal server error'
    }

     */
    try {

        const data = {
            code: req.body.code,
            title: req.body.title,
            author: req.body.author,
            stock: req.body.stock,
        };

        const result = await bookModel.update(data, {
            where: {
                code: req.body.code
            }
        });
        if (result === 0) {
            res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                error: {
                    message: "Data not found!",
                },
            });
        } else {
            res.status(200).json({
                code: "200",
                status: "OK",
                data: data,
            });
        }
    } catch (e) {
        handleErrorRes(res, e);
    }
};

exports.delete = async (req, res) => {
    /*
    #swagger.tags = ['Book']
    #swagger.description = 'Endpoint to delete a book.'

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Success" },
        description: 'Success'
    }

    #swagger.responses[404] = {
        schema: { $ref: "#/definitions/NotFoundError" },
        description: 'Data not found'
    }

    #swagger.responses[500] = {
        schema: { $ref: "#/definitions/InternalError" },
        description: 'Internal server error'
    }
     */
    try {
        const bookCode = req.params.bookCode;
        const result = await bookModel.destroy({
            where: {
                code: bookCode
            }
        });
        if (result === 0) {
            res.status(404).json({
                code: "404",
                status: "NOT_FOUND",
                error: {
                    message: "Data not found!",
                },
            });

        } else {
            res.status(200).json({
                code: "200",
                status: "OK",
                message: `Delete Item with code ${bookCode} success.`,
            });
        }
    } catch (e) {
        handleErrorRes(res, e);
    }
};
