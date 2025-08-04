import {
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';
// Sequelize models
import { Reviews } from '../../models';
import ReviewsType from '../../types/ReviewsType';
import showErrorMessage from '../../../helpers/showErrorMessage';
import updateReviewsCount from '../../../helpers/updateReviewsCount';

const writeReview = {
    type: ReviewsType,
    args: {
        reservationId: { type: new NonNull(IntType) },
        listId: { type: new NonNull(IntType) },
        receiverId: { type: new NonNull(StringType) },
        reviewContent: { type: new NonNull(StringType) },
        rating: { type: new NonNull(FloatType) },
        automated: { type: BooleanType },
    },
    async resolve({ request, response }, {
        reservationId,
        listId,
        receiverId,
        reviewContent,
        rating,
        automated
    }) {
        try {
            // Check if user already logged in
            if (request?.user && !request?.user?.admin) {

                const userId = request?.user?.id;
                let parentId = 0, isReviewCreated = false;

                const isOtherUserReview = await Reviews.findOne({
                    where: {
                        reservationId,
                        userId,
                        isAdminEnable: true
                    }
                });

                if (isOtherUserReview?.authorId == userId) {
                    return {
                        status: '400'
                    }
                } else if (isOtherUserReview) {
                    parentId = isOtherUserReview?.id;
                }

                const createReview = await Reviews.findOrCreate({
                    where: {
                        reservationId,
                        authorId: userId,
                        isAdminEnable: true
                    },
                    defaults: {
                        //properties you want on create
                        reservationId,
                        listId,
                        authorId: userId,
                        userId: receiverId,
                        reviewContent,
                        rating,
                        parentId,
                        automated
                    }
                })
                    .spread((review, created) => {
                        if (created) {
                            isReviewCreated = true;
                        }
                    });

                isReviewCreated && await updateReviewsCount({ userId: receiverId, listId });

                return {
                    status: isReviewCreated ? '200' : '400'
                }
            } else {
                return {
                    status: "notLoggedIn",
                };
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default writeReview;

/**
mutation writeReview(
    $reservationId: Int!,
    $listId: Int!,
    $receiverId: String!,
    $reviewContent: String!,
    $rating: Float!,
){
    writeReview(
        reservationId: $reservationId,
        listId: $listId,
        receiverId: $receiverId,
        reviewContent: $reviewContent,
        rating: $rating,
    ) {
        status
    }
}
**/
