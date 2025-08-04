'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add the megasoftVoucher column to Reservations table
    return queryInterface.addColumn('Reservation', 'megasoftVoucher', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    // Remove the megasoftVoucher column from Reservations table
    return queryInterface.removeColumn('Reservation', 'megasoftVoucher');
  }
};
