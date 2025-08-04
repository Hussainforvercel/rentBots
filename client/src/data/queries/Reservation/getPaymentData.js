import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { Reservation, ListBlockedDates } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage'

const getPaymentData = {

  type: ReservationType,

  args: {
    reservationId: { type: new NonNull(IntType) }
  },

  async resolve({ request }, { reservationId }) {
    try {
      if (!request?.user) {
        return {
          status: "notLoggedIn",
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
      }

      const userId = request?.user?.id;

      const data = await Reservation.findOne({
        where: {
          id: reservationId,
          paymentState: 'pending',
          guestId: userId,
          checkIn: {
            $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
          },
          $or: [
            {
              reservationState: 'pending'
            },
            {
              reservationState: 'approved'
            }
          ]
        }
      });

      if (data) {
        const blockedDates = await ListBlockedDates.find({
          where: {
            blockedDates: {
              $between: [data.checkIn, data.checkOut]
            },
            listId: data.listId,
            calendarStatus: 'blocked'
          }
        });

        if (blockedDates) {
          return null;
        }
      }

      return data;

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getPaymentData;