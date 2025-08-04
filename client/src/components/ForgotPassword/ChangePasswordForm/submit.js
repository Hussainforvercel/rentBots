import { updatePassword } from '../../../actions/ForgotPassword/updateForgotPassword';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  if (values?.newPassword != values?.confirmPassword) {
    showToaster({ messageId: 'confirmPasswordError', toasterType: 'error' })
    return;
  }

  dispatch(updatePassword(values.email, values.newPassword))

}

export default submit;
