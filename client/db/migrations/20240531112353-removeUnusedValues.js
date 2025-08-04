'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('SiteSettings', {
        name: {
          in: ['paypalHostMode', 'paypalEmail', 'homePageLogoWidth', 'homePageLogoHeight', 'videoLink', 'logoHeight', 'logoWidth']
        }
      }),
      queryInterface.bulkDelete('StaticInfoBlock', {
        name: {
          $in: ['carCounterTitle1', 'carCounterContent1', 'carCounterTitle2', 'carBlockTitle1', 'carBlockTitle2', 'carCounterContent2', 'carCounterTitle3', 'carBlockContent1', 'carBlockImage1', 'carTripContent1']
        }
      }),
      queryInterface.bulkDelete('WhyHostInfoBlock', {
        name: {
          $in: ['earnBlockContent2']
        }
      }),
      queryInterface.sequelize.query("DELETE FROM PrivilegesURL WHERE id=3 AND permittedUrls='/siteadmin/users';"),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([])
  }
};
