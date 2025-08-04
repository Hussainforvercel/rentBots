import DataType from 'sequelize';
import Model from '../sequelize.js';

const EmailTemplate = Model.define('EmailTemplate', {
  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataType.STRING,
    allowNull: false,
    unique: true
  },
  subject: {
    type: DataType.STRING,
    allowNull: false
  },
  body: {
    type: DataType.TEXT('long'),
    allowNull: false
  },
  language: {
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'en'
  }
});

export default EmailTemplate; 