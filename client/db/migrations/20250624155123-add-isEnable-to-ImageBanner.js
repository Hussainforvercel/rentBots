'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add the isEnable column to ImageBanner
    return queryInterface.addColumn('ImageBanner', 'isEnable', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    // Remove the isEnable column from ImageBanner
    return queryInterface.removeColumn('ImageBanner', 'isEnable');
  }
};
