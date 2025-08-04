import {
  ADMIN_DELETE_USER_START,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_DELETE_USER_ERROR
} from '../../constants';
import history from '../../core/history';
import { deleteUser as mutation } from '../../lib/graphql';
import showToaster from '../../helpers/toasterMessages/showToaster';
// import sendSocketNotification from '../../core/socket/sendSocketNotification';

export function deleteUser(userId, profileId) {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: ADMIN_DELETE_USER_START,
        data: userId
      });

      const { data } = await client.mutate({
        mutation,
        variables: { userId }
      });

      if (data.deleteUser.status == "success") {
        dispatch({
          type: ADMIN_DELETE_USER_SUCCESS,
        });
        showToaster({ messageId: 'deleteUser', toasterType: 'success' })
        history.push('/siteadmin/users');
        return {
          status: 200
        }
        // sendSocketNotification(`userlogout-${userId}`, '')
      } else if (data.deleteUser.status == "activebooking") {
        dispatch({
          type: ADMIN_DELETE_USER_ERROR,
        });
        showToaster({ messageId: 'deleteUserDetails', toasterType: 'error', requestMessage: data.deleteUser.errorMessage });
        return {
          status: 400
        }
      } else {
        showToaster({ messageId: 'deleteUserFailed', toasterType: 'error' })
        return {
          status: 400
        }
      }

    } catch (error) {
      dispatch({
        type: ADMIN_DELETE_USER_ERROR,
        payload: {
          error
        }
      });
      return {
        status: 400
      }
    }
  };
}
