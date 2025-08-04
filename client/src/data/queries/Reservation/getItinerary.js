import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getItinerary = {

  type: ReservationType,

  args: {
    reservationId: { type: new NonNull(IntType) }
  },

  async resolve({ request }, { reservationId }) {
    try {
      const id = reservationId;
      const userId = request?.user?.id;
      let where;

      if (!request?.user) {
        return {
          status: "notLoggedIn",
        };
      }

      if (request?.user?.admin) {
        where = {
          id
        };
      } else {
        where = {
          id,
          $or: [
            {
              hostId: userId
            },
            {
              guestId: userId
            }
          ]
        };
      }

      return await Reservation.findOne({
        where
      });

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getItinerary;