import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.earnBlockTitle1) {
    errors.earnBlockTitle1 = messages.required;
  } else if (values.earnBlockTitle1.trim() == "") {
    errors.earnBlockTitle1 = messages.required;
  } else if (values.earnBlockTitle1 && values?.earnBlockTitle1?.length > inputTextLimit) {
    errors.earnBlockTitle1 = messages.inputTextLimitError;
  }

  if (!values.earnBlockContent1) {
    errors.earnBlockContent1 = messages.required;
  } else if (values.earnBlockContent1.trim() == "") {
    errors.earnBlockContent1 = messages.required;
  } else if (values.earnBlockContent1 && values?.earnBlockContent1?.length > inputDescLimit) {
    errors.earnBlockContent1 = messages.inputDescLimitError;
  }

  return errors
}

export default validate;