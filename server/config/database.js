const { Sequelize } = require('sequelize');
require('dotenv').config();

// ใช้ MySQL สำหรับฐานข้อมูล
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ud_hotels',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false // ตั้งให้ console.log สำหรับการแก้ไข
  }
);

module.exports = sequelize;
