import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.name) {
    errors.name = messages.required;
  } else if (values.name && values.name.toString().trim() == "") {
    errors.name = messages.required;
  } else if (values?.name?.length > inputTextLimit) {
    errors.name = messages.inputTextLimitError;
  }

  if (values.description && values.description.toString().trim() == "") {
    errors.description = messages.required;
  } else if (values?.description?.length > inputDescLimit) {
    errors.description = messages.inputDescLimitError;
  }

  if (!values.privileges || (values.privileges && values.privileges.length <= 0)) {
    errors.privileges = messages.required;
  }

  return errors
}

export default validate
