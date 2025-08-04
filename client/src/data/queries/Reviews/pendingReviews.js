import {
  GraphQLList as List,
} from 'graphql';
import sequelize from '../../sequelize';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const pendingReviews = {

  type: new List(ReservationType),

  async resolve({ request, response }) {
    try {
      const userId = request?.user?.id;

      if (!request?.user) {
        return {
          status: 'notLoggedIn',
          errorMessage: await showErrorMessage({ errorCode: 'loginError' })
        };
      }

      return await Reservation.findAll({
        where: {
          reservationState: 'completed',
          $or: [
            {
              hostId: userId
            },
            {
              guestId: userId
            }
          ],
          id: {
            $notIn: [
              sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
            ]
          }
        },
      });
    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  },
};

export default pendingReviews;