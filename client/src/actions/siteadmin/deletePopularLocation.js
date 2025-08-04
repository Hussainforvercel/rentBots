import {
    ADMIN_DELETE_POPULARLOCATION_START,
    ADMIN_DELETE_POPULARLOCATION_SUCCESS,
    ADMIN_DELETE_POPULARLOCATION_ERROR
} from '../../constants';
import history from '../../core/history';
import showToaster from '../../helpers/toasterMessages/showToaster';
import {
    getPopularLocation as query, deletePopularLocationMutation,
    updatePopularLocationStatusMutation
} from '../../lib/graphql';

const deletePopularLocation = (id) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: ADMIN_DELETE_POPULARLOCATION_START,
                data: id
            });

            const { data } = await client.mutate({
                mutation: deletePopularLocationMutation,
                variables: { id },
                refetchQueries: [{ query }]
            });

            if (data?.deletePopularLocation?.status == "200") {
                dispatch({
                    type: ADMIN_DELETE_POPULARLOCATION_SUCCESS,
                });
                showToaster({ messageId: 'deletePopularLocation', toasterType: 'success' })
                history.push('/siteadmin/popularlocation');
            } else {
                showToaster({ messageId: 'deletePopularLocationFailed', toasterType: 'error' })
            }

        } catch (error) {
            dispatch({
                type: ADMIN_DELETE_POPULARLOCATION_ERROR,
                payload: {
                    error
                }
            });

        }
    };
}

const updateLocationStatus = (id, isEnable) => {
    return async (dispatch, getState, { client }) => {

        try {
            const { data } = await client.mutate({
                mutation: updatePopularLocationStatusMutation,
                variables: { id, isEnable },
                refetchQueries: [{ query }]
            });

            if (data?.updatePopularLocationStatus?.status === "success") {
                showToaster({ messageId: 'locationStatusChanged', toasterType: 'success' })
            }

        } catch (error) {
            showToaster({ messageId: 'locationStatusFailed', toasterType: 'error' })
            return false;
        }
        return true;
    };
}

export { deletePopularLocation, updateLocationStatus };