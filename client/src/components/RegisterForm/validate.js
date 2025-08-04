import messages from '../../locale/messages';
import { inputTextLimit, validateEmail } from '../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.firstName) {
    errors.firstName = messages.required;
  } else if (values.firstName.trim() == "") {
    errors.firstName = messages.required;
  } else if (values?.firstName?.length > inputTextLimit) {
    errors.firstName = messages.inputTextLimitError;
  };

  if (!values.lastName) {
    errors.lastName = messages.required;
  } else if (values.lastName.trim() == "") {
    errors.lastName = messages.required;
  } else if (values?.lastName?.length > inputTextLimit) {
    errors.lastName = messages.inputTextLimitError;
  }

  if (!values.email) {
    errors.email = messages.required;
  } else if (validateEmail(values.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.password) {
    errors.password = messages.required;
  } else if (values.password && /\s/.test(values.password)) {
    errors.password = messages.invalidPasswordSpace;
  } else if (values.password.length < 8) {
    errors.password = messages.passwordInvalid;
  }

  return errors
}

export default validate
