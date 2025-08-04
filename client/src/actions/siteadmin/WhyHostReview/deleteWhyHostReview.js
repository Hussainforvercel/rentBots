import {
    ADMIN_DELETE_REVIEW_START,
    ADMIN_DELETE_REVIEW_SUCCESS,
    ADMIN_DELETE_REVIEW_ERROR,
    UPDATE_REVIEW_START,
    UPDATE_REVIEW_SUCCESS,
    UPDATE_REVIEW_ERROR
} from '../../../constants';
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { deleteReviewMutation, updateReviewMutation } from '../../../lib/graphql';

const deleteWhyHostReview = ({ reviewId }) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: ADMIN_DELETE_REVIEW_START,
                data: reviewId
            });

            const { data } = await client.mutate({
                mutation: deleteReviewMutation,
                variables: { reviewId }
            });

            if (data?.deleteWhyHostReview?.status === 200) {
                dispatch({
                    type: ADMIN_DELETE_REVIEW_SUCCESS,
                });
                showToaster({ messageId: 'deleteReview', toasterType: 'success' });
                return{
                    status : 200
                }
            } else {
                showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: data?.deleteWhyHostReview?.errorMessage });
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

const updateReview = (values) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: UPDATE_REVIEW_START
            });

            const { data } = await client.mutate({
                mutation: updateReviewMutation,
                variables: {
                    id: values.id,
                    userName: values.userName,
                    reviewContent: values.reviewContent,
                    image: values.image,
                    isEnable: values.isEnable == 'false' ? 0 : 1
                },
            });

            if (data?.updateWhyHostReview?.status === 200) {
                dispatch({
                    type: UPDATE_REVIEW_SUCCESS,
                });
                showToaster({ messageId: 'userReviewUpdated', toasterType: 'success' })
                history.push('/siteadmin/reviews');
            } else {
                showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: data?.updateWhyHostReview?.errorMessage })
            }

            history.push('/siteadmin/whyHost/review');

        } catch (error) {
            dispatch({
                type: UPDATE_REVIEW_ERROR,
                payload: {
                    error
                }
            });
        }
    };
}

export { deleteWhyHostReview, updateReview };