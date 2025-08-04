import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
import sequelize from '../../sequelize';
import { Reservation } from '../../models';
import ReservationType from '../../types/ReservationType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const writeReviewData = {

    type: ReservationType,

    args: {
        reservationId: { type: new NonNull(IntType) },
    },

    async resolve({ request, response }, { reservationId }) {
        try {
            if (!request?.user) {
                return {
                    status: 'notLoggedIn',
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }

            const userId = request?.user?.id;
            return await Reservation.findOne({
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
                    $and: [
                        {
                            id: reservationId,
                        },
                        {
                            id: {
                                $notIn: [
                                    sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${userId}'`)
                                ]
                            }
                        }
                    ]
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

export default writeReviewData;