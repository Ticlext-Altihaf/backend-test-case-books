const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Books = require("./book");



const Members = sequelize.define("tbl_members", {
    code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    penalty_expired: {//penalty expired date
        type: DataTypes.DATE,
        allowNull: true,
    }
});


//check if empty, dev only
Members.sync().then(() => {
    Members.count().then(count => {
        if (count === 0) {
            mockData.forEach(data => {
                Members.create(data);
            });
        }
    });
})

module.exports = Members;