import {
  USER_LOGOUT_START,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERROR,
  SET_RUNTIME_VARIABLE
} from '../constants';
import history from '../core/history';
import { userLogout as query } from '../lib/graphql';

export const setUserLogout = ({ isAdmin }) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: USER_LOGOUT_START,
      });

      const { data } = await client.query({ query, fetchPolicy: 'network-only' });

      if (data?.userLogout?.status == "success") {

        // Redirect to Home page
        isAdmin ? history.push('/siteadmin/login') : history.push('/');
        window.location.reload();

        // Successully logged out
        dispatch({
          type: USER_LOGOUT_SUCCESS
        });

        // Update the Authentication status
        dispatch({
          type: SET_RUNTIME_VARIABLE,
          payload: {
            name: 'isAuthenticated',
            value: false,
          }
        });

      } else {
        dispatch({
          type: USER_LOGOUT_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: USER_LOGOUT_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
