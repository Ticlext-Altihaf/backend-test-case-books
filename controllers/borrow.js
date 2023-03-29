const memberModel = require("../models/member");
const bookModel = require("../models/book");
const borrowedBookModel = require("../models/borrowed_book");
const {handleErrorRes} = require("../config/error-handler");

borrowedBookModel.belongsTo(memberModel, {foreignKey: "memberCode"});
borrowedBookModel.belongsTo(bookModel, {foreignKey: "bookCode"});

/**
 * - Members can borrow books with conditions
 *    - [ ]  Members may not borrow more than 2 books
 *    - [ ]  Borrowed books are not borrowed by other members
 *    - [ ]  Member is currently not being penalized
 */

// POST /borrow
exports.borrow = async (req, res) => {
    /*
    #swagger.tags = ['Borrow']
    #swagger.description = 'Endpoint to borrow a book.'

    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/definitions/Borrow"
                }
            }
        }
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/ResponseBorrow" },
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
        const memberCode = req.body.memberCode;
        const bookCode = req.body.bookCode;

        const member = await memberModel.findByPk(memberCode);
        if (!member) {
            throw new TypeError("Member not found!");
        }

        //check if member is currently being penalized
        if (member.penalty_expired) {
            //check if penalty expired
            const penaltyExpired = new Date(member.penalty_expired);
            const now = new Date();
            if (penaltyExpired > now) {
                res.status(400).json({
                    code: "400",
                    status: "BAD_REQUEST",
                    error: {
                        message: "Member is currently being penalized!",
                    },
                });
                return;
            }
            //reset penalty expired
            member.penalty_expired = null;
            await member.save();
        }
        const book = await bookModel.findByPk(bookCode);
        if (!book) {
            throw new TypeError("Book not found!");
        }
        //check if member has borrowed more than 2 books
        const memberTotalBorrowed = await borrowedBookModel.count({
            where: {
                memberCode: memberCode,
            }
        });
        if (memberTotalBorrowed >= 2) {
            res.status(400).json({
                code: "400",
                status: "BAD_REQUEST",
                error: {
                    message: "Member has borrowed more than 2 books!",
                },
            });
            return;
        }

        //check if book is borrowed by other members
        let totalBookBorrowed = await borrowedBookModel.count({
            where: {
                bookCode: bookCode,
            }
        });
        if (totalBookBorrowed >= book.stock) {
            res.status(400).json({
                code: "400",
                status: "BAD_REQUEST",
                error: {
                    message: "Book is borrowed by other members!",
                },
            });
            return;
        }

        //check if valid date
        const borrowedDate = Date.parse(req.body.borrowedDate || new Date());
        if (isNaN(borrowedDate)) {
            res.status(400).json({
                code: "400",
                status: "BAD_REQUEST",
                error: {
                    message: "Invalid date!",
                },
            });
            return;
        }


        borrowedBook = await borrowedBookModel.create({
            memberCode: memberCode,
            bookCode: bookCode,
            borrowedDate: borrowedDate,
        });

        res.status(200).json({
            code: "200",
            status: "OK",
            data: borrowedBook,
        });
    } catch (e) {
        handleErrorRes(res, e)
    }
}


/**
 * - Member returns the book with conditions
 *    - [ ]  The returned book is a book that the member has borrowed
 *    - [ ]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
 */

// POST /return
exports.return = async (req, res) => {
/*
#swagger.tags = ['Borrow']
#swagger.description = 'Endpoint to return a book.'

#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                $ref: "#/definitions/Return"
            }
        }
    }
}

#swagger.responses[200] = {
    schema: { $ref: "#/definitions/Success" },
    description: 'Success'
}

#swagger.responses[400] = {
    schema: { $ref: "#/definitions/Error" },
    description: 'Bad Request'
}

#swagger.responses[500] = {
    schema: { $ref: "#/definitions/Error" },
    description: 'Internal Server Error'
}
 */
    try {
        const memberCode = req.body.memberCode;
        const bookCode = req.body.bookCode;

        const member = await memberModel.findByPk(memberCode);
        const book = await bookModel.findByPk(bookCode);
        if (!member) {
            throw new TypeError("Member not found!");
        }
        if (!book) {
            throw new TypeError("Book not found!");
        }

        const returnedDate = Date.parse(req.body.returnedDate || new Date());
        //check if valid date
        if (isNaN(returnedDate)) {
            res.status(400).json({
                code: "400",
                status: "BAD_REQUEST",
                error: {
                    message: "Invalid date!",
                },
            });
            return;
        }

        const borrowedBook = await borrowedBookModel.findOne({
            where: {
                memberCode: memberCode,
                bookCode: bookCode,
            }
        });
        //check if the returned book is a book that the member has borrowed
        if (borrowedBook) {
            const borrowedDate = new Date(borrowedBook.borrowedDate);
            let message = "book returned successfully";
            //check if the book is returned after more than 7 days
            if (returnedDate - borrowedDate > 7 * 24 * 60 * 60 * 1000) {
                //set penalty expired
                member.penalty_expired = new Date();
                member.penalty_expired.setDate(member.penalty_expired.getDate() + 3);
                await member.save();
                message += " but member is being penalized until " + member.penalty_expired + " due to returning the book after more than " + (returnedDate - borrowedDate) / (24 * 60 * 60 * 1000) + " days";
            }
            //delete borrowed book
            await borrowedBook.destroy();
            res.status(200).json({
                code: "200",
                status: "OK",
                message: message,
            });
        } else {
            res.status(400).json({
                code: "400",
                status: "BAD_REQUEST",
                error: {
                    message: "The returned book is not a book that the member has borrowed!",
                },
            });
        }
    } catch (e) {
        handleErrorRes(res, e)
    }
}