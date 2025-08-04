// import { Listing, Recommend } from '../../../data/models';
import  Listing  from '../../models/Listing.js';
import  Recommend  from '../../models/Recommend.js';
import ListType from '../../types/ListType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getRecommend = {
  type: ListType,
  async resolve({ request }) {

    try {
      if (request && request.user) {
        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }
      }

      // Get Recommended Listings
      const getRecommendList = Listing.findAll({
        where: {
          isPublished: true
        },
        include: [
          { model: Recommend, as: "recommend", required: true },
        ]
      });

      return {
        results: getRecommendList,
        status: getRecommendList ? 200 : 400,
        errorMessage: getRecommendList ? null : await showErrorMessage({ errorCode: 'invalidError' }),
      }
    }
    catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  }
};

export default getRecommend;