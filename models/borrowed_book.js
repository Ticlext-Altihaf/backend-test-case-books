const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BorrowedBook = sequelize.define('BorrowedBook', {
    bookCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    memberCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    borrowedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

BorrowedBook.sync();
module.exports = BorrowedBook;