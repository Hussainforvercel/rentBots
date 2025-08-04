// Redux Form
import { SubmissionError, reset } from 'redux-form';

// Fetch Request
import fetch from '../../core/fetch';
import showToaster from '../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  if (values?.newPassword != values?.confirmPassword) {
    showToaster({ messageId: 'confirmPasswordError', toasterType: 'error' })
    return;
  }

  const query = `
    mutation (
        $oldPassword: String,
        $newPassword: String,
        $confirmPassword: String,
        $registeredType: String,
    ) {
        ChangePassword (
            oldPassword: $oldPassword,
            newPassword: $newPassword,
            confirmPassword: $confirmPassword,
            registeredType: $registeredType
        ) {
            status
        }
    }
  `;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: values
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data?.ChangePassword?.status === 'success') {
    showToaster({ messageId: 'passwordUpdateSuccess', toasterType: 'success' })
    // Clear form data
    dispatch(reset('ChangePasswordForm'));
  } else if (data?.ChangePassword?.status === 'WrongPassword') {
    showToaster({ messageId: 'incorrectPassword', toasterType: 'error' })
  } else if (data?.ChangePassword?.status === 'notLoggedIn') {
    showToaster({ messageId: 'userNotLogin', toasterType: 'error' })
  } else if (data?.ChangePassword?.status === 'WrongConfirmPassword') {
    showToaster({ messageId: 'currentPassword', toasterType: 'error' })
  } else {
    showToaster({ messageId: 'changePasswordError', toasterType: 'error' })
  }

}

export default submit;
