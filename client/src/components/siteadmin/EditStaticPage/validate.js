import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';
import messages from '../../../locale/messages';

const validate = values => {

  const errors = {}

  if (!values.content) {
    errors.content = messages.required;
  } else if (values.content && values.content.trim() == '' ) {
    errors.content = messages.required;
  }
  
  if (!values.metaTitle) {
    errors.metaTitle = messages.required;
  } else if (values.metaTitle && values.metaTitle.trim() == '' ) {
    errors.metaTitle = messages.required;
  } else if (values?.metaTitle?.length > inputTextLimit) {
    errors.metaTitle = messages.inputTextLimitError
  }

  if (!values.metaDescription) {
    errors.metaDescription = messages.required;
  } else if (values.metaDescription && values.metaDescription.trim() == '' ) {
    errors.metaDescription = messages.required;
  } else if (values?.metaDescription?.length > inputDescLimit) {
    errors.metaDescription = messages.inputDescLimitError
  }

  return errors
}

export default validate
