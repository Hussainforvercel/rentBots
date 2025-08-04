'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'ListBlockedDates',
        'blockedDates',
        {
          type: Sequelize.DATEONLY,
          allowNull: false
        }
      ),
      queryInterface.changeColumn(
        'ReservationSpecialPricing',
        'blockedDates',
        {
          type: Sequelize.DATEONLY,
          allowNull: false
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'ListBlockedDates',
        'blockedDates',
        {
          type: DataType.DATE,
          allowNull: false,
        }
      ),
      queryInterface.changeColumn(
        'ReservationSpecialPricing',
        'blockedDates',
        {
          type: DataType.DATE,
          allowNull: false,
        }
      ),
    ]);
  }
};
