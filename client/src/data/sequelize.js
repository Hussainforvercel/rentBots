import Sequelize from 'sequelize';
import { databaseUrl } from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(databaseUrl, {
  define: {
    freezeTableName: true
  },
  dialectOptions: {
    charset: 'utf8mb4'
  },
  logging: console.log
});

export default sequelize;
