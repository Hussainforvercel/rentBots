import { GraphQLString as StringType, } from 'graphql';
import SiteSettings from '../../models/siteAdmin/SiteSettings.js';
import SiteSettingsCommonType from '../../types/siteadmin/SiteSettingsType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';

const siteSettings = {
  type: SiteSettingsCommonType,
  args: {
    type: { type: StringType },
  },
  async resolve({ request }, { type }) {

    try {
      let siteSettingsData;
      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }
      if (type != null) {
        // Get Specific Type of Settings Data
        siteSettingsData = await SiteSettings.findAll({
          attributes: [
            'id',
            'title',
            'name',
            'value',
            'type'
          ],
          where: {
            type: type,
            name: {
              $notIn: ['platformSecretKey', 'smtpHost', 'smtpPort', 'smptEmail', 'smtpSender', 'smtpSenderEmail', 'smtpPassWord', 'twillioAccountSid', 'twillioAuthToken', 'twillioPhone', 'fcmPushNotificationKey', 'pushNotificationKey']
            },
          }
        });
      } else {
        // Get All Site Settings Data
        siteSettingsData = await SiteSettings.findAll({
          attributes: [
            'id',
            'title',
            'name',
            'value',
            'type'
          ],
          where: {
            name: {
              $notIn: ['platformSecretKey', 'smtpHost', 'smtpPort', 'smptEmail', 'smtpSender', 'smtpSenderEmail', 'smtpPassWord', 'twillioAccountSid', 'twillioAuthToken', 'twillioPhone', 'fcmPushNotificationKey', 'pushNotificationKey']
            },
          }
        });
      }
      return {
        status: 200,
        results: siteSettingsData
      };
    } catch (error) {
      return {
        errorMessage: 'Something went wrong' + error,
        status: 400
      };
    }
  },
};

export default siteSettings;