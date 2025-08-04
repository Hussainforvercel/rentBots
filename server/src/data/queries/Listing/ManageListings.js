import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
// import { Listing, User } from '../../../data/models';
import Listing from '../../models/Listing.js';
import User from '../../models/User.js'
import WholeManageListingsType from '../../types/WholeManageListingsType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const ManageListings = {
  type: WholeManageListingsType,
  args: {
    requestType: { type: StringType },
    currentPage: { type: IntType }
  },
  async resolve({ request }, { requestType, currentPage }) {

    try {
      if (request.user && request.user.admin != true) {
        const limit = 10; let offset = 0, where = { userId: request.user.id }, queryOptions;

        if (currentPage) {
          offset = (currentPage - 1) * limit;
        }

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        const userId = request.user.id;
        const userEmail = await User.findOne({
          attributes: [
            'email',
            'userBanStatus'
          ],
          where: {
            id: userId,
            userDeletedAt: {
              $eq: null
            },
          }
        });

        if (requestType === 'inProgress') {
          where.isReady = { $ne: 1 };
        } else if (requestType === 'listed') {
          where.isReady = 1;
          where.isPublished = 1;
        } else if (requestType === 'unListed') {
          where.isReady = 1;
          where.isPublished = 0;
        } else if (requestType === 'completed') {
          where.isReady = 1;
          where.isPublished = {
            $in: [0, 1]
          };
        }

        if (userEmail && !userEmail.userBanStatus) {
          queryOptions = {
            where,
            order: [[`createdAt`, `DESC`]],
          };

          // Apply pagination only if currentPage is provided
          if (currentPage) {
            queryOptions = {
              ...queryOptions,
              limit,
              offset,
            };
          }

          const count = await Listing.count({ where });
          // Get listingData 
          const listingData = await Listing.findAll(queryOptions);

          return {
            results: listingData,
            count,
            status: listingData ? 200 : 400,
            errorMessage: listingData ? null : await showErrorMessage({ errorCode: 'invalidError' }),
          }
        } else {
          return {
            status: 500,
            errorMessage: await showErrorMessage({ errorCode: 'errorCheck' })
          }
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
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

export default ManageListings;
