import {
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const viewReservationAdmin = {

  type: ReservationType,
  args: {
    id: { type: new NonNull(IntType) }

  },
  async resolve({ request }, { id }) {
    try {
      let paymentState = 'completed';

      if (!request?.user?.admin) {
        return {
          status: "notLoggedIn",
          errorMessage: await showErrorMessage({ errorCode: 'adminLogin' })
        };
      }

      return await Reservation.findOne({
        where: {
          paymentState,
          id: id
        },
        order: [['createdAt', 'DESC']]
      });

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default viewReservationAdmin;