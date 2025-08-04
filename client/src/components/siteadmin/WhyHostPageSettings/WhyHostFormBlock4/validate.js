import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.easyHostTitle1) {
    errors.easyHostTitle1 = messages.required;
  } else if (values.easyHostTitle1.trim() == "") {
    errors.easyHostTitle1 = messages.required;
  } else if (values.easyHostTitle1 && values?.easyHostTitle1?.length > inputTextLimit) {
    errors.easyHostTitle1 = messages.inputTextLimitError;
  }

  if (!values.easyHostContent1) {
    errors.easyHostContent1 = messages.required;
  } else if (values.easyHostContent1.trim() == "") {
    errors.easyHostContent1 = messages.required;
  } else if (values.easyHostContent1 && values?.easyHostContent1?.length > inputDescLimit) {
    errors.easyHostContent1 = messages.inputDescLimitError;
  }

  if (!values.easyHostContent2) {
    errors.easyHostContent2 = messages.required;
  } else if (values.easyHostContent2.trim() == "") {
    errors.easyHostContent2 = messages.required;
  } else if (values.easyHostContent2 && values?.easyHostContent2?.length > inputDescLimit) {
    errors.easyHostContent2 = messages.inputDescLimitError;
  }

  if (!values.workTitle1) {
    errors.workTitle1 = messages.required;
  } else if (values.workTitle1.trim() == "") {
    errors.workTitle1 = messages.required;
  } else if (values.workTitle1 && values?.workTitle1?.length > inputTextLimit) {
    errors.workTitle1 = messages.inputTextLimitError;
  }

  if (!values.workTitle2) {
    errors.workTitle2 = messages.required;
  } else if (values.workTitle2.trim() == "") {
    errors.workTitle2 = messages.required;
  } else if (values.workTitle2 && values?.workTitle2?.length > inputTextLimit) {
    errors.workTitle2 = messages.inputTextLimitError;
  }

  if (!values.workContent1) {
    errors.workContent1 = messages.required;
  } else if (values.workContent1.trim() == "") {
    errors.workContent1 = messages.required;
  } else if (values.workContent1 && values?.workContent1?.length > inputDescLimit) {
    errors.workContent1 = messages.inputDescLimitError;
  }

  if (!values.workContent2) {
    errors.workContent2 = messages.required;
  } else if (values.workContent2.trim() == "") {
    errors.workContent2 = messages.required;
  } else if (values.workContent2 && values?.workContent2?.length > inputDescLimit) {
    errors.workContent2 = messages.inputDescLimitError;
  }

  return errors
}

export default validate;