'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Reservation', 'megasoftVoucher', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Reservation', 'megasoftVoucher', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};