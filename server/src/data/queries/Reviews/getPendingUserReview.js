import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import Reservation from '../../models/Reservation.js';
import CommonReservationType from '../../types/Reservation/CommonReservationType.js';
import sequelize from '../../sequelize.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getPendingUserReview = {
    type: CommonReservationType,
    args: {
        reservationId: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { reservationId }) {

        try {
            let userId, where = {};
            if (request && request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                userId = request.user.id;
                where = {
                    reservationState: 'completed',
                    $or: [
                        {
                            hostId: userId
                        },
                        {
                            guestId: userId
                        }
                    ],
                    $and: [
                        {
                            id: reservationId
                        },
                        {
                            id: {
                                $notIn: [
                                    sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
                                ]
                            }
                        }
                    ]
                };

                const result = await Reservation.findOne({
                    attributes: ['id', 'reservationState', 'guestId', 'hostId', 'listId'],
                    where
                });

                return await {
                    status: result ? 200 : 400,
                    result,
                    errorMessage: result ? null : await showErrorMessage({ errorCode: 'noReviews' })
                };
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
                };
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getPendingUserReview;