import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getFailedTransaction = {
  type: ReservationType,

  args: {
    id: { type: new NonNull(IntType) }
  },

  async resolve({ request }, { id }) {
    try {
      if (!request?.user?.admin) {
        return {
          status: "notLoggedIn",
        };
      }

      return await Reservation.findOne({
        where: {
          id: id,
          $or: [
            {
              reservationState: 'completed'
            },
            {
              reservationState: 'cancelled'
            }
          ]
        },
        order: [['createdAt', 'DESC']]
      });

    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getFailedTransaction;