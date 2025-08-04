import DataType from 'sequelize';
import Model from '../sequelize.js';

const UserListingData = Model.define('UserListingData', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true
  },

  listId: {
    type: DataType.INTEGER,
    allowNull: false
  },

  settingsId: {
    type: DataType.INTEGER,
    allowNull: false
  }

});

export default UserListingData;
