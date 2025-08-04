module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('PayoutMegasoftDetails', 'nationalId', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('PayoutMegasoftDetails', 'bankName', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('PayoutMegasoftDetails', 'pagoMovilPhone', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('PayoutMegasoftDetails', 'nationalId'),
      queryInterface.removeColumn('PayoutMegasoftDetails', 'bankName'),
      queryInterface.removeColumn('PayoutMegasoftDetails', 'pagoMovilPhone'),
    ]);
  }
};