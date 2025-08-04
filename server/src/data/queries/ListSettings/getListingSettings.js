import ListSettingsTypes  from '../../../data/models/siteAdmin/ListSettingsTypes.js';
import ListSettingsCommonType from '../../types/ListingSettingsCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getListingSettings = {
  type: ListSettingsCommonType,
  async resolve({ request }) {

    try {
      let where;
      where = Object.assign({}, where, { isEnable: true });

      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      const getResults = await ListSettingsTypes.findOne({
        attributes: ['id'],
        where
      });

      if (!getResults) {
        return await {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
          results: null
        }
      }

      return await {
        status: 200,
        results: getResults,
      }
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default getListingSettings;