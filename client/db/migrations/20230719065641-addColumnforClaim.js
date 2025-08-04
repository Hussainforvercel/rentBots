'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Reservation', 'isClaimRefunded', {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      }),
      queryInterface.addColumn('TransactionHistory', 'payoutType', {
        type: Sequelize.ENUM('claimPayout', 'payout'),
        defaultValue: 'payout'
      }),
      queryInterface.renameColumn('Reservation', 'isHostClaim', 'isClaimPaidOut')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Reservation', 'isClaimRefunded'),
      queryInterface.removeColumn('TransactionHistory', 'payoutType'),
      queryInterface.renameColumn('Reservation', 'isClaimPaidOut', 'isHostClaim')
    ])
  }
};
