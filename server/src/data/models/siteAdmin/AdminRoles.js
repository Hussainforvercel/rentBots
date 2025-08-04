import DataType from 'sequelize';
import Model from '../../sequelize.js';

const AdminRoles = Model.define('AdminRoles', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },

  name: {
    type: DataType.STRING,
    allowNull: false,
  },

  description: {
    type: DataType.TEXT
  }

});

export default AdminRoles;
