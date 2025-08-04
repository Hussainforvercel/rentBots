import messages from '../../../locale/messages';
import { validateEmail } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.email) {
    errors.email = messages.required;
  } else if (validateEmail(values.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.password) {
    errors.password = messages.required;
  }else if (values.password && /\s/.test(values.password)) {
    errors.password = messages.invalidPasswordSpace;
  } else if (values.password.length < 8) {
    errors.password = messages.passwordInvalid;
  }

  return errors
}

export default validate