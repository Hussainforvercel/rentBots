import history from '../../core/history';
import {
  UPDATE_FORGOT_PASSWORD_START,
  UPDATE_FORGOT_PASSWORD_SUCCESS,
  UPDATE_FORGOT_PASSWORD_ERROR,
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { changeForgotPassword as mutation } from '../../lib/graphql';

export const updatePassword = (email, newPassword) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: UPDATE_FORGOT_PASSWORD_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          email,
          newPassword
        }
      });

      if (data?.changeForgotPassword) {
        if (data?.changeForgotPassword?.status === '200') {
          showToaster({ messageId: 'updatePassword', toasterType: 'success' })
          history.push('/login');
        } else {
          showToaster({ messageId: 'tryAgain', toasterType: 'error' })
          return false;
        }

        dispatch({
          type: UPDATE_FORGOT_PASSWORD_SUCCESS,
        });
      }

    } catch (error) {
      dispatch({
        type: UPDATE_FORGOT_PASSWORD_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}