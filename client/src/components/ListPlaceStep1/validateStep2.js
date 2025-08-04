import messages from '../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../helpers/fieldRestriction';


const validateStep2 = values => {

  const errors = {}

  if (!values.title) {
    errors.title = messages.required;
  } else if (values.title && values.title.trim() == "") {
    errors.title = messages.required;
  } else if (values.title && values?.title?.length > inputTextLimit) {
    errors.title = messages.inputTextLimitError;
  }

  if (!values.description) {
    errors.description = messages.required;
  } else if (values.description && values.description.trim() == "") {
    errors.description = messages.required;
  } else if (values?.description?.length > inputDescLimit) {
    errors.description = messages.inputDescLimitError;
  }

  return errors
}

export default validateStep2
