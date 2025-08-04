import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import { Reservation } from '../../models';
import AllReservationType from '../../types/AllReservationType';
import sequelize from '../../sequelize';

const getAllPayoutReservation = {

  type: AllReservationType,
  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType },
  },

  async resolve({ request }, { currentPage, searchList }) {
    try {
      const limit = 10;
      let offset = 0, paymentState = 'completed', reservationData, count, where;

      if (!request?.user?.admin) {
        return {
          status: 'Not loggedin'
        };
      }

      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }

      if (searchList) {
        where = {
          $or: [
            {
              confirmationCode: {
                $like: '%' + searchList + '%'
              }
            },
            {
              id: {
                $like: '%' + searchList + '%'
              }
            },
            {
              reservationState: {
                $like: '%' + searchList + '%'
              }
            },
            {
              listId: {
                $in: [
                  sequelize.literal(`
                    SELECT
                      id
                    FROM
                      Listing
                    WHERE title like "%${searchList}%"
                  `)
                ]
              }
            },

          ],
          paymentState

        }
        count = await Reservation.count({
          where
        });
        reservationData = await Reservation.findAll({
          limit,
          offset,
          order: [['createdAt', 'DESC']],
          where
        });
      } else {
        reservationData = await Reservation.findAll({
          where: {
            paymentState
          },
          order: [['createdAt', 'DESC']],
          limit,
          offset
        });
        count = await Reservation.count({
          where: {
            paymentState
          }
        });
      }
      return {
        reservationData,
        count
      };
    } catch (error) {
      return {
        status: '400',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getAllPayoutReservation;