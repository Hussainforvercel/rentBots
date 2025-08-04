import {
    ADMIN_DELETE_BlOGDETAILS_START,
    ADMIN_DELETE_BlOGDETAILS_SUCCESS,
    ADMIN_DELETE_BlOGDETAILS_ERROR
} from '../../constants';
import history from '../../core/history';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getBlogDetails as query, deleteBlogDetailsMutation, updateBlogStatusMutation } from '../../lib/graphql';

const deleteBlogDetails = (id) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: ADMIN_DELETE_BlOGDETAILS_START,
                data: id
            });

            const { data } = await client.mutate({
                mutation: deleteBlogDetailsMutation,
                variables: { id },
                refetchQueries: [{ query }]
            });

            if (data?.deleteBlogDetails?.status == "200") {
                dispatch({
                    type: ADMIN_DELETE_BlOGDETAILS_SUCCESS,
                });
                showToaster({ messageId: 'deleteBlogDetails', toasterType: 'success' })
                history.push('/siteadmin/content-management');
            } else {
                showToaster({ messageId: 'blogDeletionFailed', toasterType: 'error' })
            }

        } catch (error) {
            dispatch({
                type: ADMIN_DELETE_BlOGDETAILS_ERROR,
                payload: {
                    error
                }
            });

        }

    };
}

const updateBlogStatus = (id, isEnable) => {
    return async (dispatch, getState, { client }) => {

        try {
            const { data } = await client.mutate({
                mutation: updateBlogStatusMutation,
                variables: { id, isEnable },
                refetchQueries: [{ query }]
            });

            if (data?.updateBlogStatus?.status === "success") {
                showToaster({ messageId: 'updateBlogStatus', toasterType: 'success' })
            }
        } catch (error) {
            showToaster({ messageId: 'updateBlogStatusFailed', toasterType: 'error' })
            return false;
        }
        return true;
    };
}

export { deleteBlogDetails, updateBlogStatus };