
require("dotenv").config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.production" });

const env = {
   node_env: process.env.NODE_ENV,
   sequelize_url: process.env.DATABASE_URL,
   log_path: process.env.LOG_PATH,
   host: process.env.HOST,
   port: process.env.PORT,
};

module.exports = env;