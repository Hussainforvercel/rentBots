'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('SiteSettings', [{
        title: 'OG Image',
        name: 'ogImage',
        value: '',
        type: 'site_settings',
        createdAt: new Date(),
        updatedAt: new Date()
      }])
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('SiteSettings', {
      name: {
        in: ['ogImage']
      }
    })
  }
};
