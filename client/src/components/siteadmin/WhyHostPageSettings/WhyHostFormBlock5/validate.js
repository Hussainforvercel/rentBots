import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.workTitleHeading) {
    errors.workTitleHeading = messages.required;
  } else if (values.workTitleHeading.trim() == "") {
    errors.workTitleHeading = messages.required;
  } else if (values.workTitleHeading && values?.workTitleHeading?.length > inputTextLimit) {
    errors.workTitleHeading = messages.inputTextLimitError;
  }


  if (!values.peaceTitle1) {
    errors.peaceTitle1 = messages.required;
  } else if (values.peaceTitle1.trim() == "") {
    errors.peaceTitle1 = messages.required;
  } else if (values.peaceTitle1 && values?.peaceTitle1?.length > inputTextLimit) {
    errors.peaceTitle1 = messages.inputTextLimitError;
  }

  if (!values.peaceTitle2) {
    errors.peaceTitle2 = messages.required;
  } else if (values.peaceTitle2.trim() == "") {
    errors.peaceTitle2 = messages.required;
  } else if (values.peaceTitle2 && values?.peaceTitle2?.length > inputTextLimit) {
    errors.peaceTitle2 = messages.inputTextLimitError;
  }

  if (!values.peaceContent1) {
    errors.peaceContent1 = messages.required;
  } else if (values.peaceContent1.trim() == "") {
    errors.peaceContent1 = messages.required;
  } else if (values.peaceContent1 && values?.peaceContent1?.length > inputDescLimit) {
    errors.peaceContent1 = messages.inputDescLimitError;
  }

  if (!values.peaceContent2) {
    errors.peaceContent2 = messages.required;
  } else if (values.peaceContent2.trim() == "") {
    errors.peaceContent2 = messages.required;
  } else if (values.peaceContent2 && values?.peaceContent2?.length > inputDescLimit) {
    errors.peaceContent2 = messages.inputDescLimitError;
  }


  return errors
}

export default validate;