import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType
} from 'graphql';
// import { Reviews, Reservation } from '../../models';
import Reviews from '../../models/Reviews.js';
import Reservation from '../../models/Reservation.js';
import CommonType from '../../types/CommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import sequelize from '../../sequelize.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'
import { updateReviewsCount } from '../../../helpers/updateReviewsCount.js';

const writeUserReview = {
    type: CommonType,
    args: {
        reservationId: { type: new NonNull(IntType) },
        listId: { type: new NonNull(IntType) },
        reviewContent: { type: new NonNull(StringType) },
        rating: { type: new NonNull(FloatType) },
        receiverId: { type: new NonNull(StringType) }
    },
    async resolve({ request }, {
        reservationId,
        listId,
        reviewContent,
        rating,
        receiverId
    }) {
        try {
            if (request.user && !request.user.admin) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let parentId = 0, authorId = request.user.id;

                const reservationData = await Reservation.findOne({
                    attributes: ['id'],
                    where: {
                        reservationState: 'completed',
                        $or: [
                            {
                                hostId: authorId
                            },
                            {
                                guestId: authorId
                            }
                        ],
                        $and: [
                            {
                                id: reservationId
                            },
                            {
                                id: {
                                    $notIn: [
                                        sequelize.literal(`SELECT reservationId FROM Reviews WHERE authorId='${authorId}'`)
                                    ]
                                }
                            }
                        ]
                    },
                    raw: true
                });

                if (reservationData) {
                    const existingOtherReview = await Reviews.findOne({
                        attributes: ['id'],
                        where: {
                            reservationId,
                            userId: authorId
                        },
                        raw: true
                    });
                    parentId = existingOtherReview && existingOtherReview.id;

                    const createReview = await Reviews.create({
                        reservationId,
                        listId,
                        authorId,
                        userId: receiverId,
                        reviewContent,
                        rating,
                        parentId
                    });

                    createReview && updateReviewsCount({ listId, userId: receiverId })

                    return await {
                        status: 200
                    };
                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'checkReview' })
                    };
                }
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

export default writeUserReview;

/**
 
mutation writeUserReview($reservationId: Int!, $listId: Int!, $reviewContent: String!, $rating: Float!, $receiverId: String!) {
  writeUserReview(reservationId: $reservationId, listId: $listId, reviewContent: $reviewContent, rating: $rating, receiverId: $receiverId) {
    status
    errorMessage
  }
}


**/