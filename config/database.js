const { Sequelize } = require('sequelize');
const env = require("../env");
const sequelize = new Sequelize(env.sequelize_url || 'sqlite::memory:', {
    logging: process.env.NODE_ENV === 'development'
});
module.exports = sequelize ;
