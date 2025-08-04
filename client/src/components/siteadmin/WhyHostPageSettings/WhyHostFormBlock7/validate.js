import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.userName) {
    errors.userName = messages.required;
  } else if (values?.userName?.trim() == "") {
    errors.userName = messages.required;
  } else if (values?.userName?.length > inputTextLimit) {
    errors.userName = messages.inputTextLimitError;
  }

  if (!values.reviewContent) {
    errors.reviewContent = messages.required;
  } else if (values?.reviewContent?.trim() == "") {
    errors.reviewContent = messages.required;
  } else if (values?.reviewContent?.length > inputDescLimit) {
    errors.reviewContent = messages.inputDescLimitError;
  }

  return errors
}

export default validate;