import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';
// import { Reservation, User } from '../../models';
import  User  from '../../models/User.js';
import  Reservation  from '../../models/Reservation.js';
import AllReservationType from '../../types/AllReservationType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getAllReservation = {
    type: AllReservationType,
    args: {
        userType: { type: StringType },
        currentPage: { type: IntType },
        dateFilter: { type: StringType }
    },
    async resolve({ request }, { userType, currentPage, dateFilter }) {

        try {
            const limit = 10;
            let offset = 0;
            // Offset from Current Page

            if (currentPage) {
                offset = (currentPage - 1) * limit;
            }
            if (request.user && request.user.id) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const userId = request.user.id;
                let where, order, paymentState = 'completed', today = new Date();

                today.setHours(0, 0, 0, 0);

                let statusFilter = {
                    $in: ['pending', 'approved']
                };

                if (dateFilter == 'previous') {

                    statusFilter = {
                        $in: ['expired', 'completed', 'cancelled', 'declined']
                    };
                }

                if (userType === 'owner') {
                    where = {
                        hostId: userId,
                        paymentState,
                        reservationState: statusFilter

                    };
                } else {
                    where = {
                        guestId: userId,
                        paymentState,
                        reservationState: statusFilter

                    };
                }

                const userData = await User.findOne({
                    attributes: ['userBanStatus'],
                    where: { id: request.user.id },
                    raw: true
                })

                if (userData && userData.userBanStatus == 1) {
                    return await {
                        errorMessage: await showErrorMessage({ errorCode: 'contactSupport' }),
                        status: 500
                    };
                }
                order = dateFilter == 'previous' ? [['checkIn', 'DESC']] : [['checkIn', 'ASC']]
                const count = await Reservation.count({ where });

                const reservationData = await Reservation.findAll({
                    where,
                    order,
                    limit: limit,
                    offset: offset,
                });

                if (reservationData && reservationData.length > 0) {
                    return {
                        result: reservationData,
                        count,
                        status: 200
                    };
                } else if (reservationData && reservationData.length == 0) {
                    return {
                        status: 400,
                        result: [],
                        count: 0,
                        errorMessage: await showErrorMessage({ errorCode: 'noBookingFound' })
                    };
                } else {
                    return {
                        status: 400,
                        result: [],
                        errorMessage: await showErrorMessage({ errorCode: 'processError' })
                    };
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'login' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default getAllReservation;