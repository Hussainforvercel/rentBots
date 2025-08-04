import DataType from 'sequelize';
import Model from '../sequelize.js';

const UserLogin = Model.define('UserLogin', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataType.STRING
  },

  key: {
    type: DataType.STRING
  },

  userId: {
    type: DataType.STRING
  },

  deviceType: {
    type: DataType.STRING
  },

  deviceDetail: {
    type: DataType.TEXT
  },

  deviceId: {
    type: DataType.STRING
  }

});

export default UserLogin;
