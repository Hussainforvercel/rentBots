import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.title1) {
    errors.title1 = messages.required;
  } else if (values.title1.trim() == "") {
    errors.title1 = messages.blankSpace;
  } else if (values?.title1?.length > inputTextLimit) {
    errors.title1 = messages.inputTextLimitError;
  }

  if (!values.content1) {
    errors.content1 = messages.required;
  } else if (values.content1.trim() == "") {
    errors.content1 = messages.blankSpace;
  } else if (values?.content1?.length > inputDescLimit) {
    errors.content1 = messages.inputDescLimitError;
  }

  if (!values.title2) {
    errors.title2 = messages.required;
  } else if (values.title2.trim() == "") {
    errors.title2 = messages.blankSpace;
  } else if (values?.title2?.length > inputTextLimit) {
    errors.title2 = messages.inputTextLimitError;
  };

  if (!values.content2) {
    errors.content2 = messages.required;
  } else if (values.content2.trim() == "") {
    errors.content2 = messages.blankSpace;
  } else if (values?.content2?.length > inputDescLimit) {
    errors.content2 = messages.inputDescLimitError;
  }

  if (!values.title3) {
    errors.title3 = messages.required;
  } else if (values.title3.trim() == "") {
    errors.title3 = messages.blankSpace;
  } else if (values?.title3?.length > inputTextLimit) {
    errors.title3 = messages.inputTextLimitError;
  }

  if (!values.content3) {
    errors.content3 = messages.required;
  } else if (values.content3.trim() == "") {
    errors.content3 = messages.blankSpace;
  } else if (values?.content3?.length > inputDescLimit) {
    errors.content3 = messages.inputDescLimitError;
  }

  return errors
}

export default validate;