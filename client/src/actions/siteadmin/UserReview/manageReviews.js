import {
    UPDATE_REVIEW_START,
    UPDATE_REVIEW_SUCCESS,
    UPDATE_REVIEW_ERROR,

} from '../../../constants';
import query from '../../../routes/siteadmin/userReviews/userReviewsQuery.graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { updateReview as mutation } from '../../../lib/graphql';

export const updateReviewStatus = (id, type, refetchVariables) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: UPDATE_REVIEW_START,
            });

            const { data } = await client.mutate({
                mutation,
                variables: { id, type },
                refetchQueries: [{ query, variables: refetchVariables }]
            });

            if (data?.updateReview?.status === "success") {
                dispatch({
                    type: UPDATE_REVIEW_SUCCESS,
                });
                showToaster({ messageId: 'userReviewUpdated', toasterType: 'success' })
            } else {
                dispatch({
                    type: UPDATE_REVIEW_ERROR,
                    payload: {
                        status
                    }
                });
            }
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



