'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ListBlockedDates', 'startTime', {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: true
    });

    await queryInterface.addColumn('ListBlockedDates', 'endTime', {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ListBlockedDates', 'startTime');
    await queryInterface.removeColumn('ListBlockedDates', 'endTime');
  }
};
