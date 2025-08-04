import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType
} from 'graphql';
import { Reservation } from '../../models';
import AllReservationType from '../../types/AllReservationType';
import sequelize from '../../sequelize';
import { securityDepositSearchHelper } from '../../../helpers/adminSearchHelpers';

const getAllReservationAdmin = {

  type: AllReservationType,
  args: {
    currentPage: { type: IntType },
    searchList: { type: StringType },
    claimType: { type: StringType },
    isClaimDetails: { type: BooleanType }
  },

  async resolve({ request }, { currentPage, searchList, claimType, isClaimDetails }) {
    try {
      let reservationData, count, where, paymentState = 'completed', offset = 0;

      if (!request?.user?.admin) {
        return {
          status: 'Not loggedin'
        };
      }

      const limit = 10;

      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }

      if (isClaimDetails) {
        where = {
          paymentState,
          securityDeposit: {
            $gt: 0
          }
        };

        if (searchList) {
          where['$or'] = securityDepositSearchHelper(searchList)
        }

        if (claimType == 'claimed') where.claimStatus = { $in: ['approved', 'fullyRefunded'] };
        else if (claimType == 'nonClaimed') where.claimStatus = { $in: ['requested', 'pending'] };
        else where.claimStatus = { $in: ['requested', 'approved', 'fullyRefunded', 'pending'] };

        reservationData = await Reservation.findAll({
          where,
          raw: true,
          limit,
          offset,
          order: [['updatedAt', 'DESC']],
        });

        count = await Reservation.count({
          where
        });

        return {
          reservationData,
          count,
          currentPage
        }
      };

      if (searchList) {
        where = {
          $or: [
            {
              id: {
                $like: '%' + searchList + '%'
              }
            },
            {
              confirmationCode: {
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
            }
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
        count,
        currentPage
      };
    } catch (error) {
      return {
        status: '500'
      };
    }
  }
};

export default getAllReservationAdmin;