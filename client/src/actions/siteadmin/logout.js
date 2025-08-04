import {
    ADMIN_USER_LOGOUT_START,
    ADMIN_USER_LOGOUT_SUCCESS,
    ADMIN_USER_LOGOUT_ERROR,
    SET_RUNTIME_VARIABLE
} from '../../constants';
import { adminUserLogout as query } from '../../lib/graphql';

export const adminLogout = () => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: ADMIN_USER_LOGOUT_START
            });

            const { data } = await client.query({
                query,
                fetchPolicy: 'network-only'
            })

            if (data?.adminUserLogout?.status === 200) {

                dispatch({
                    type: ADMIN_USER_LOGOUT_SUCCESS
                });
                dispatch({
                    type: SET_RUNTIME_VARIABLE,
                    payload: {
                        name: 'isAdminAuthenticated',
                        value: false
                    }
                });

            } else {
                dispatch({
                    type: ADMIN_USER_LOGOUT_ERROR
                });
            }
        } catch (error) {
            dispatch({
                type: ADMIN_USER_LOGOUT_ERROR,
                payload: {
                    error
                }
            });
            return false;
        }
        return true;
    }
}