import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.title) {
    errors.title = messages.required;
  } else if (values.title && values.title.trim() == '' ) {
    errors.title = messages.required;
  } else if (values?.title?.length > inputTextLimit) {
    errors.title = messages.inputTextLimitError
  }

  if (!values.content) {
    errors.content = messages.required;
  } else if (values.content && values.content.trim() == '' ) {
    errors.content = messages.required;
  } else if (values?.content?.length > inputDescLimit) {
    errors.content = messages.inputDescLimitError
  }

  return errors
}

export default validate;