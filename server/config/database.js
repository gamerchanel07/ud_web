const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use MySQL for database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ud_hotels',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false // set to console.log for debugging
  }
);

module.exports = sequelize;
