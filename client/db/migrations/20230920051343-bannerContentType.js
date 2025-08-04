'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Banner', 'content', {
        type: Sequelize.TEXT,
        allowNull: false
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Banner', 'content', {
        type: Sequelize.STRING,
      })
    ])
  }
};
