'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add the isHourly column to Reservations table
    return queryInterface.addColumn('Reservation', 'isHourly', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    // Remove the isHourly column from Reservations table
    return queryInterface.removeColumn('Reservation', 'isHourly');
  }
};
