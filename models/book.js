const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Books = sequelize.define("tbl_books", {
    code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});


//check if empty, dev only
Books.sync().then(() => {
    Books.count().then(count => {
        if (count === 0) {
            mockData.forEach(data => {
                Books.create(data);
            });
        }
    });
});

module.exports = Books;