require("dotenv").config();
module.exports = {
  development: {
    username: process.env.test_DB_USERNAME,
    password: process.env.test_DB_PASSWORD,
    database: process.env.test_DATABASE,
    host: process.env.test_DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
  },

  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
    },
  },
};
