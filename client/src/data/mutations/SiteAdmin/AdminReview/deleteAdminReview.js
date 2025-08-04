import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull
} from 'graphql';
// Sequelize models
import { Reviews } from '../../../models';
import ReviewsType from '../../../types/ReviewsType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const deleteAdminReview = {
    type: ReviewsType,
    args: {
        reviewId: { type: new NonNull(IntType) }
    },
    async resolve({ request, response }, {
        reviewId
    }) {
        try {
            if (request?.user?.admin) {
                const reviewDetails = await Reviews.findById(reviewId);
                if (!reviewDetails) {
                    return {
                        status: '404'
                    }
                }

                const deleteReview = await Reviews.destroy({
                    where: {
                        id: reviewId
                    }
                });

                return {
                    status: deleteReview ? '200' : '400'
                }
            } else {
                return {
                    status: 'notLoggedIn'
                }
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    }
}

export default deleteAdminReview;