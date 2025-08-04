import { inputDescLimit } from '../../../helpers/fieldRestriction';
import messages from '../../../locale/messages';

const validate = values => {

  const errors = {}

  if (!values.content) {
    errors.content = messages.required;
  }else if (values.content && values.content.toString().trim() == '') {
    errors.content = messages.required;
  } else if (values.content && values?.content?.length > inputDescLimit) {
    errors.content = messages.inputDescLimitError;
  }

  return errors;
}

export default validate;