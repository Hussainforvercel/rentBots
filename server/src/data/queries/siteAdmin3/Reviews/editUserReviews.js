import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { Reviews } from '../../../models';
import ReviewsType from '../../../types/ReviewsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const editUserReviews = {

    type: ReviewsType,

    args: {
        reviewId: { type: new NonNull(IntType) },
    },

    async resolve({ request }, { reviewId }) {
        try {
            const reviewData = await Reviews.find({
                attributes: [
                    'id',
                    'listId',
                    'reviewContent',
                    'rating'
                ],
                where: {
                    id: reviewId
                }
            });

            return reviewData;
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default editUserReviews;