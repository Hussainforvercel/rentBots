const { Sequelize } = require('sequelize');

// Updated configuration using mysql dialect for MariaDB
const sequelize = new Sequelize(
  'rental_cars',  // Database Name
  'root',         // Username
  '',             // Password (empty for local development)
  {
    host: 'localhost',
    dialect: 'mysql',  // Changed from 'mariadb' to 'mysql'
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log
  }
);

module.exports = sequelize;