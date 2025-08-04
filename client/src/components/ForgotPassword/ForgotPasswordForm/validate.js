import messages from '../../../locale/messages';
import { validateEmail } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.email) {
    errors.email = messages.required;
  } else if (validateEmail(values.email)) {
    errors.email = messages.emailInvalid;
  }

  return errors
}

export default validate;
