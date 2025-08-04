import DataType from 'sequelize';
import moment from 'moment';
import Model from '../sequelize';

const ListBlockedDates = Model.define('ListBlockedDates', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  listId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataType.STRING,
    defaultValue: '',
    allowNull: true
  },
  endTime: {
    type: DataType.STRING,
    defaultValue: '',
    allowNull: true
  },
  reservationId: {
    type: DataType.INTEGER,
  },

  blockedDates: {
    type: DataType.DATEONLY,
    allowNull: false,
  },

  calendarId: {
    type: DataType.INTEGER,
  },

  calendarStatus: {
    type: DataType.ENUM('available', 'blocked', 'reservation'),
  },

  isSpecialPrice: {
    type: DataType.DOUBLE,
  }

});

export default ListBlockedDates;
