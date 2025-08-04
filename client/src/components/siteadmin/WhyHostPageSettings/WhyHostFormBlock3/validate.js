import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.whyBlockTitle1) {
    errors.whyBlockTitle1 = messages.required;
  } else if (values.whyBlockTitle1.trim() == "") {
    errors.whyBlockTitle1 = messages.required;
  } else if (values.whyBlockTitle1 && values?.whyBlockTitle1?.length > inputTextLimit) {
    errors.whyBlockTitle1 = messages.inputTextLimitError;
  }

  if (!values.whyBlockTitle2) {
    errors.whyBlockTitle2 = messages.required;
  } else if (values.whyBlockTitle2.trim() == "") {
    errors.whyBlockTitle2 = messages.required;
  } else if (values.whyBlockTitle2 && values?.whyBlockTitle2?.length > inputTextLimit) {
    errors.whyBlockTitle2 = messages.inputTextLimitError;
  }

  if (!values.whyBlockContent1) {
    errors.whyBlockContent1 = messages.required;
  } else if (values.whyBlockContent1.trim() == "") {
    errors.whyBlockContent1 = messages.required;
  } else if (values.whyBlockContent1 && values?.whyBlockContent1?.length > inputDescLimit) {
    errors.whyBlockContent1 = messages.inputDescLimitError;
  }

  if (!values.whyBlockContent2) {
    errors.whyBlockContent2 = messages.required;
  } else if (values.whyBlockContent2.trim() == "") {
    errors.whyBlockContent2 = messages.required;
  } else if (values.whyBlockContent2 && values?.whyBlockContent2?.length > inputDescLimit) {
    errors.whyBlockContent2 = messages.inputDescLimitError;
  }
  
  return errors
}

export default validate;