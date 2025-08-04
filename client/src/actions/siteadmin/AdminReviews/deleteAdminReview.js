import {
    ADMIN_DELETE_REVIEW_START,
    ADMIN_DELETE_REVIEW_SUCCESS,
    ADMIN_DELETE_REVIEW_ERROR
} from '../../../constants';

// Redirection
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster'
import { deleteAdminReview as mutation } from '../../../lib/graphql';

export const deleteAdminReview = (reviewId) => {
    return async (dispatch, getState, { client }) => {

        try {

            dispatch({
                type: ADMIN_DELETE_REVIEW_START,
                data: reviewId
            });

            const { data } = await client.mutate({
                mutation,
                variables: { reviewId }
            });

            if (data?.deleteAdminReview?.status == "200") {
                dispatch({
                    type: ADMIN_DELETE_REVIEW_SUCCESS,
                });
                showToaster({ messageId: 'deleteReview', toasterType: 'success' })
                history.push('/siteadmin/reviews');
                return{
                    status : 200
                }
            } else {
                showToaster({ messageId: 'deleteReviewFailed', toasterType: 'error' });
                return{
                    status : 400
                }
            }

        } catch (error) {
            dispatch({
                type: ADMIN_DELETE_REVIEW_ERROR,
                payload: {
                    error
                }
            });
            return{
                status : 400
            }
        }
    };
}