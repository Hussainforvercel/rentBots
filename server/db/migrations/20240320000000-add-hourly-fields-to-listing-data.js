'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ListingData', 'minHours', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('ListingData', 'maxHours', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('ListingData', 'hourlyPrice', {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      }),
      queryInterface.addColumn('ListingData', 'hourlyDiscount', {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      }),
      queryInterface.addColumn('ListingData', 'dailyDiscount', {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ListingData', 'minHours'),
      queryInterface.removeColumn('ListingData', 'maxHours'),
      queryInterface.removeColumn('ListingData', 'hourlyPrice'),
      queryInterface.removeColumn('ListingData', 'hourlyDiscount'),
      queryInterface.removeColumn('ListingData', 'dailyDiscount')
    ]);
  }
}; 