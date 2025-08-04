'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Reservation', 'hostServiceFeeType', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Reservation', 'hostServiceFeeValue', {
        type: Sequelize.FLOAT,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.drop('Reservation', 'hostServiceFeeType'),
      queryInterface.drop('Reservation', 'hostServiceFeeValue')
    ])
  }
};
