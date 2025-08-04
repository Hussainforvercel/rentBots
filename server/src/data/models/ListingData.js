import DataType from 'sequelize';
import Model from '../sequelize.js';

const ListingData = Model.define('ListingData', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  listId: {
    type: DataType.INTEGER,
  },

  bookingNoticeTime: {
    type: DataType.STRING,
  },

  checkInStart: {
    type: DataType.STRING,
  },

  checkInEnd: {
    type: DataType.STRING,
  },

  maxDaysNotice: {
    type: DataType.ENUM('unavailable', '3months', '6months', '9months', '12months', 'available'),
    defaultValue: 'unavailable',
  },

  minDay: {
    type: DataType.INTEGER,
  },

  maxDay: {
    type: DataType.INTEGER,
  },

  minHours: {
    type: DataType.INTEGER,
    defaultValue: 0,
  },

  maxHours: {
    type: DataType.INTEGER,
    defaultValue: 0,
  },

  priceMode: {
    type: DataType.BOOLEAN,
  },

  basePrice: {
    type: DataType.DOUBLE,
  },

  hourlyPrice: {
    type: DataType.DOUBLE,
    defaultValue: 0,
  },

  delivery: {
    type: DataType.DOUBLE,
  },

  maxPrice: {
    type: DataType.FLOAT,
  },

  currency: {
    type: DataType.STRING,
  },

  hostingFrequency: {
    type: DataType.STRING,
  },

  weeklyDiscount: {
    type: DataType.STRING,
  },

  monthlyDiscount: {
    type: DataType.STRING,
  },

  hourlyDiscount: {
    type: DataType.DOUBLE,
    defaultValue: 0,
  },

  dailyDiscount: {
    type: DataType.DOUBLE,
    defaultValue: 0,
  },

  cancellationPolicy: {
    type: DataType.INTEGER,
    defaultValue: 1,
  },

  securityDeposit: {
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0
  }

});

export default ListingData;
