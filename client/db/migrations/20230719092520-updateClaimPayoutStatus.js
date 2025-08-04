'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE Reservation SET isClaimPaidOut = 1 WHERE 1 = 1; "),
      queryInterface.addColumn('FailedTransactionHistory', 'payoutType', {
        type: Sequelize.ENUM('claimPayout', 'payout'),
        defaultValue: 'payout'
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE Reservation SET isClaimPaidOut = 0 WHERE 1 = 1; "),
      queryInterface.removeColumn('FailedTransactionHistory', 'payoutType'),
    ])
  }
};
