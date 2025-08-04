import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
// import { UserListingSteps } from '../../../data/models';
import UserListingSteps  from '../../models/UserListingSteps.js';
import ShowListingStepsType from '../../types/ShowListingStepsType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const showListingSteps = {
  type: ShowListingStepsType,
  args: {
    listId: { type: new NonNull(StringType) },
  },
  async resolve({ request }, { listId }) {

    try {
      // Check if user already logged in
      if (request.user) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        // Get All Listing Data
        const listingSteps = await UserListingSteps.findOne({
          attributes: [
            'id',
            'listId',
            'step1',
            'step2',
            'step3'
          ],
          where: {
            listId: listId
          }
        });

        return {
          results: listingSteps,
          status: listingSteps ? 200 : 400,
          errorMessage: listingSteps ? null : await showErrorMessage({ errorCode: 'invalidError' }),
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default showListingSteps;
