'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('StaticPage',[
        {
          pageName: 'Cookie Policy',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
          metaTitle: "Cookie Policy",
          metaDescription: "Cookie Policy",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelet('StaticPage', {
        pageName: {
          $in: ['Cookie Policy']
        }
      })
    ])
  }
};
