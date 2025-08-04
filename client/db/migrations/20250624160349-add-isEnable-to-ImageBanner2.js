'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add the isEnable column to MarketingBanner
    return queryInterface.addColumn('MarketingBanner', 'isEnable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    // Remove the isEnable column from MarketingBanner
    return queryInterface.removeColumn('MarketingBanner', 'isEnable');
  }
};
