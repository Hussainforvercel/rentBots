import {
    GraphQLInt as IntType
} from 'graphql';
import { AdminReviews } from '../../../models';
import WhyHostReviewType from '../../../types/siteadmin/WhyHostReviewType';
import showErrorMessage from '../../../../helpers/showErrorMessage';

const getWhyHostReview = {

    type: WhyHostReviewType,
    args: {
        reviewId: { type: IntType },
    },

    async resolve({ request }, { reviewId }) {
        try {

            if (!request.user) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userLoggedIn' })
                }
            }

            const result = await AdminReviews.findOne({
                attributes: ['id', 'userName', 'reviewContent', 'image', 'isEnable'],
                where: {
                    id: reviewId
                }
            });

            return {
                result,
                status: result ? 200 : 400,
                errorMessage: result ? null : await showErrorMessage({ errorCode: 'fetchRecordsError' })
            }

        } catch (e) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error: e })
            }
        }
    }
};

export default getWhyHostReview;
