import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';
import { ListBlockedDates } from '../../../data/models/ListBlockedDates.js';
import ContactHostAvailabilityType from '../../types/ContactHostAvailabilityType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getDateAvailability = {
  type: ContactHostAvailabilityType,
  args: {
    listId: { type: new NonNull(IntType) },
    startDate: { type: new NonNull(StringType) },
    endDate: { type: new NonNull(StringType) },
  },
  async resolve({ request, response }, { listId, startDate, endDate }) {

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

      const checkAvailableDates = await ListBlockedDates.findAll({
        where: {
          listId,
          blockedDates: {
            $between: [startDate, endDate]
          }
        }
      });

      return {
        status: checkAvailableDates.length > 0 ? "NotAvailable" : "Available"
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default getDateAvailability;
