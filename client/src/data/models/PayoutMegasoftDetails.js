import DataType from 'sequelize';
import Model from '../sequelize';

const PayoutMegasoftDetails = Model.define('PayoutMegasoftDetails', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },

  accountType: {
    type: DataType.ENUM('individual', 'company'),
    allowNull: false,
    defaultValue: 'individual'
  },

  firstName: {
    type: DataType.STRING,
    allowNull: false
  },

  lastName: {
    type: DataType.STRING,
    allowNull: false
  },

  accountName: {
    type: DataType.STRING,
    allowNull: false
  },

  confirmAccountName: {
    type: DataType.STRING,
    allowNull: false
  },

  nationalId: {
    type: DataType.STRING,
    allowNull: true
  },

  bankName: {
    type: DataType.STRING,
    allowNull: true
  },

  pagoMovilPhone: {
    type: DataType.STRING,
    allowNull: true
  },

  status: {
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }

}, {
  indexes: [
    {
      unique: true,
      fields: ['userId']
    }
  ],
  timestamps: true,
  freezeTableName: true,
  tableName: 'PayoutMegasoftDetails'
});

export default PayoutMegasoftDetails; 