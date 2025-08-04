import messages from '../../locale/messages';
import { inputDescLimit, inputTextLimit, validateEmail } from '../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.firstName) {
    errors.firstName = messages.required;
  } else if (values.firstName && values.firstName.trim() == "") {
    errors.firstName = messages.required;
  } else if (values?.firstName?.length > inputTextLimit) {
    errors.firstName = messages.inputTextLimitError;
  }

  if (!values.lastName) {
    errors.lastName = messages.required;
  } else if (values.lastName && values.lastName.trim() == "") {
    errors.lastName = messages.required;
  } else if (values?.lastName?.length > inputTextLimit) {
    errors.lastName = messages.inputTextLimitError;
  }

  if (!values.email) {
    errors.email = messages.required;
  } else if (validateEmail(values.email)) {
    errors.email = messages.emailInvalid;
  }

  if (!values.gender) {
    errors.gender = messages.required;
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = messages.required;
  } else if (values.phoneNumber && values.phoneNumber.trim() == "") {
    errors.phoneNumber = messages.required;
  } else if(isNaN(values.phoneNumber)) {
    errors.phoneNumber = messages.phoneNumberInvalid;
  }


  if (!values.preferredLanguage) {
    errors.preferredLanguage = messages.required;
  }

  if (!values.preferredCurrency) {
    errors.preferredCurrency = messages.required;
  }

  if (!values.location) {
    errors.location = messages.required;
  } else if (values.location && values.location.trim() == "") {
    errors.location = messages.required;
  } else if (values?.location?.length > inputTextLimit) {
    errors.location = messages.inputTextLimitError;
  }

  if (!values.info) {
    errors.info = messages.required;
  } else if (values.info && values.info.trim() == "") {
    errors.info = messages.required;
  } else if (values?.info?.length > inputDescLimit) {
    errors.info = messages.inputDescLimitError;
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = messages.required;
  }

  return errors
}

export default validate
