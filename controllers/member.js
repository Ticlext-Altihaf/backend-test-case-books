const memberModel = require("../models/member");
const BorrowedBook = require("../models/borrowed_book");
const {handleErrorRes} = require("../config/error-handler");
const sequelize = require('sequelize')

/**
 * - Member check
 *    - [ ]  Shows all existing members
 *    - [ ]  The number of books being borrowed by each member
 */


memberModel.hasMany(BorrowedBook, {
    as:'borrowed_books',
    foreignKey: "memberCode"
});


exports.get_all = async (req, res) => {
    /*
    #swagger.tags = ['Member']
    #swagger.description = 'Endpoint to get all members.'

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/ResponseMembers" },
        description: 'Success'
    }

    #swagger.responses[500] = {
        schema: { $ref: "#/definitions/Error" },
        description: 'Internal server error'
    }
    */


    try {
        const members = await memberModel.findAll({
            attributes: {
                include: [[sequelize.fn('COUNT', sequelize.col('memberCode')), 'borrowedBooksCount']]
            },
            include: [{
                model: BorrowedBook,
                as: 'borrowed_books',
                attributes: [],
            }],
            group: ['code']
        });

        res.status(200).json({
            code: "200",
            status: "OK",
            data: members,
        });
    } catch (e) {
        handleErrorRes(res, e);
    }
};

exports.get_by_id = async (req, res) => {
    /*
    #swagger.tags = ['Member']
    #swagger.description = 'Endpoint to get a member by id.'

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/ResponseMember" },
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
        //include borrowedBooks
        let Item = await memberModel.findByPk(req.params.memberCode, {
            include: [{
                model: BorrowedBook,
                as: 'borrowed_books',
            }]
        });
        if (Item) {

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
    #swagger.tags = ['Member']
    #swagger.description = 'Endpoint to create member.'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: "#/definitions/Member"
                }
            }
        }
    }

    #swagger.responses[201] = {
        schema: { $ref: "#/definitions/ResponseMember" },
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
            name: req.body.name,
        };

        const result = await memberModel.create(data);
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

    #swagger.tags = ['Member']
    #swagger.description = 'Endpoint to update member.'
    #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
            schema: {
              $ref: "#/definitions/Member"
           }
        }
     }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/ResponseMember" },
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
            name: req.body.name,
            code: req.body.code,
        };

        const result = await memberModel.update(data, {
            where: {
                code: data.code
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

    #swagger.tags = ['Member']
    #swagger.description = 'Endpoint to delete member.'

    #swagger.responses[200] = {
     schema: { $ref: "#/definitions/Success" },
     description: 'Success'
    }

    #swagger.responses[400] = {
    schema: { $ref: "#/definitions/Error" },
    description: 'Bad request'
    }

    #swagger.responses[404] = {
    schema: { $ref: "#/definitions/Error" },
    description: 'Data not found'
    }

    #swagger.responses[500] = {
    schema: { $ref: "#/definitions/InternalError" },
    description: 'Internal server error'
    }

    */

    try {
        const memberCode = req.params.memberCode;
        const result = await memberModel.destroy({
            where: {
                id: memberCode
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
                message: `Delete Item with id ${memberCode} success.`,
            });
        }
    } catch (e) {
        handleErrorRes(res, e);
    }
};
