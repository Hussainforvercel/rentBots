'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('WhyHostInfoBlock', [
        {
          title: 'Button label',
          name: 'buttonLabel',
          value: 'Become an owner',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Button label2',
          name: 'buttonLabel2',
          value: 'Learn more',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ])
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('WhyHostInfoBlock', {
        name: {
          $in: ['buttonLabel', 'buttonLabel2']
        }
      })
    ])
  }
};
