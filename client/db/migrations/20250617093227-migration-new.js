'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('PayoutMegasoft', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payoutAmount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyerId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isAmountTransfer: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PayoutMegasoft');
  }
};
