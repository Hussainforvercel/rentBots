import {
  GraphQLList as List,
  GraphQLString as StringType,
} from 'graphql';
import { SiteSettings } from '../../../data/models';
import SiteSettingsType from '../../types/siteadmin/SiteSettingsType';

const siteSettings = {

  type: new List(SiteSettingsType),

  args: {
    type: { type: StringType },
  },

  async resolve({ request }, { type }) {
    try {
      let where = {};

      where['name'] = {
        in: [
          'siteName', 'siteTitle', 'metaKeyword', 'metaDescription', 'facebookLink', 'twitterLink', 'instagramLink',
          'homePageType', 'phoneNumberStatus', 'appAvailableStatus', 'playStoreUrl',
          'appStoreUrl', 'email', 'phoneNumber', 'address', 'faviconLogo', 'maxUploadSize', 'Logo', 'homePageLogo', 'emailLogo', 'ogImage', 'securityDepositPreference'
        ]
      };

      if (request.user && request.user.admin) {
        where['name'] = {
          notIn: ['platformSecretKey']
        };
        if (type) {
          where['type'] = {
            in: [type, 'appSettings']
          };
        }
      }

      const siteSettingsData = await SiteSettings.findAll({
        attributes: [
          'id',
          'title',
          'name',
          'value',
          'type'
        ],
        where
      });

      return siteSettingsData;
    } catch (error) {
      return {
        status: '500'
      };
    }
  },
};

export default siteSettings;
