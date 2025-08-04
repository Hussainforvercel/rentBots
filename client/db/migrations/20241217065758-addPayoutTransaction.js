'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Reservation', 'payoutTransactionId', {
        type: Sequelize.STRING,
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Reservation', 'payoutTransactionId'),
    ])
  }
};