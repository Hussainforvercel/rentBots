import {
  GraphQLString as StringType,
  GraphQLInt as IntType
} from 'graphql';
import { Reservation } from '../../models';
import AllReservationType from '../../types/AllReservationType';
import sequelize from '../../sequelize';
import showErrorMessage from '../../../helpers/showErrorMessage';

const getAllReservation = {

  type: AllReservationType,

  args: {
    userType: { type: StringType },
    currentPage: { type: IntType },
    dateFilter: { type: StringType },
    listId: { type: IntType },
    startDate: { type: StringType },
    endDate: { type: StringType },
    orderBy: { type: StringType },
    searchKey: { type: StringType }
  },

  async resolve({ request }, { userType, currentPage, dateFilter, listId, startDate, endDate, searchKey, orderBy }) {
    try {
      const limit = 5;
      let offset = 0;

      if (currentPage) {
        offset = (currentPage - 1) * limit;
      }

      if (request.user && !request.user.admin) {
        const userId = request.user.id;
        let order, where, searchFilter = {}, startDateFilter = {}, totalWhere, orderByType;
        let paymentState = 'completed', today = new Date(), statusFilter;
        today.setHours(0, 0, 0, 0);
        statusFilter = {
          $in: ['pending', 'approved']
        };

        if (dateFilter == 'previous') {
          statusFilter = {
            $in: ['expired', 'completed', 'cancelled', 'declined']
          };
        }

        if (userType === 'owner') {
          totalWhere = {
            hostId: userId,
            paymentState,
          }
        } else {
          totalWhere = {
            guestId: userId,
            paymentState,
          }
        }

        if (startDate && endDate) {
          startDateFilter = {
            $and: [sequelize.where(sequelize.fn('DATE', sequelize.col('checkIn')), '>=', startDate),
            sequelize.where(sequelize.fn('DATE', sequelize.col('checkOut')), '<=', endDate)]
          }
        }

        if (searchKey) {
          searchFilter = {
            $or: [
              {
                listId: {
                  $in: [
                    sequelize.literal(`
                  SELECT
                    id
                  FROM
                    Listing
                  WHERE title like "%${searchKey}%"
                `)
                  ]
                },
                listTitle: null
              }
              ,
              {
                id: {
                  $in: [
                    sequelize.literal(`
                    SELECT
                      id
                  FROM
                    Reservation
                  WHERE listTitle like "%${searchKey}%"
                `)
                  ]
                }
              }
            ],

          }
        }

        if (userType === 'owner') {
          where = {
            hostId: userId,
            paymentState,
            $and: [
              startDateFilter,
              searchFilter,
              {
                reservationState: statusFilter
              }
            ]
          };
        } else {
          where = {
            guestId: userId,
            paymentState,
            $and: [
              searchFilter,
              {
                reservationState: statusFilter
              }
            ]
          };
        }

        if (listId && listId > 0) where['listId'] = listId;

        orderByType = orderBy == 'DESC' && dateFilter == 'previous' ? 'ASC' : (orderBy == 'ASC' && dateFilter == 'previous' ? 'DESC' : orderBy);
        order = orderByType ? [['checkIn', orderByType]] : (dateFilter == 'previous' ? [['checkIn', 'DESC']] : [['checkIn', 'ASC']]);

        const count = await Reservation.count({ where });
        const totalCount = await Reservation.count({ where: totalWhere });

        const reservationData = await Reservation.findAll({
          where,
          order,
          limit: limit,
          offset: offset,
        });
        
        if (reservationData.length > 0) {
          return {
            reservationData,
            count,
            totalCount,
            currentPage
          };
        } else {
          return {
            reservationData,
            count,
            totalCount,
            currentPage
          };
        }

      } else {
        return {
          status: "notLoggedIn",
        };
      }

    } catch (error) {
      return {
        status: '500',
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
      };
    }
  }
};

export default getAllReservation;