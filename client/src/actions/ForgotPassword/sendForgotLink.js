import showToaster from '../../helpers/toasterMessages/showToaster';
import { closeForgotPasswordModal } from '../modalActions';
import { sendEmail } from '../../core/email/sendEmail';
import { sendForgotPassword as mutation } from '../../lib/graphql/common';
import {
  SEND_FORGOT_PASSWORD_START,
  SEND_FORGOT_PASSWORD_SUCCESS,
  SEND_FORGOT_PASSWORD_ERROR,
} from '../../constants';

export const sendForgotLink = (email) => {

  return async (dispatch, getState, { client }) => {
    try {
      let content;

      dispatch({
        type: SEND_FORGOT_PASSWORD_START,
      });
      dispatch(closeForgotPasswordModal());

      const { data } = await client.mutate({
        mutation,
        variables: {
          email
        }
      });

      if (data?.sendForgotPassword) {
        if (data?.sendForgotPassword?.status === '404') {
          showToaster({ messageId: 'adminUserLogged', toasterType: 'error' })
          return false;
        }

        if (data?.sendForgotPassword?.status === 'notAvailable') {
          showToaster({ messageId: 'forgotPassword', toasterType: 'error' })
          return false;
        }
        if (data?.sendForgotPassword?.status === '400') {
          showToaster({ messageId: 'tryAgain', toasterType: 'error' })
          return false;
        }

        content = {
          token: data?.sendForgotPassword?.token,
          email: data?.sendForgotPassword?.email,
          name: data?.sendForgotPassword?.profile?.firstName,
        };

        const { status, response } = await sendEmail(email, 'forgotPasswordLink', content);

        if (status === 200) {
          showToaster({ messageId: 'resetPasswordLink', toasterType: 'success' })
          dispatch({
            type: SEND_FORGOT_PASSWORD_SUCCESS,
          });
        } else {
          showToaster({ messageId: 'tryAgain', toasterType: 'error' });
          return false;
        }
      }

    } catch (error) {
      dispatch({
        type: SEND_FORGOT_PASSWORD_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}