import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const updateReservationPaymentState = {
  type: ReservationType,
  args: {
    reservationId: { type: new NonNull(IntType) }
  },

  async resolve({ request }, { reservationId }) {
    try {
      if (!request.user) {
        return {
          status: 'notLoggedIn'
        };
      }

      const userId = request.user.id;

      // Find the reservation and ensure it belongs to the current user
      const reservation = await Reservation.findOne({
        where: {
          id: reservationId,
          $or: [
            { guestId: userId },
            { hostId: userId }
          ]
        }
      });

      if (!reservation) {
        return {
          status: 'reservationNotFound'
        };
      }

      // Update the paymentState to 'completed'
      await Reservation.update(
        {
          paymentState: 'completed'
        },
        {
          where: {
            id: reservationId
          }
        }
      );

      return {
        status: 'updated'
      };

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default updateReservationPaymentState; 