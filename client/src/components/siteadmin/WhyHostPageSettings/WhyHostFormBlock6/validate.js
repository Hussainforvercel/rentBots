import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.peaceTitleHeading) {
    errors.peaceTitleHeading = messages.required;
  } else if (values.peaceTitleHeading.trim() == "") {
    errors.peaceTitleHeading = messages.required;
  } else if (values.peaceTitleHeading && values?.peaceTitleHeading?.length > inputTextLimit) {
    errors.peaceTitleHeading = messages.inputTextLimitError;
  }

  if (!values.peaceTitle3) {
    errors.peaceTitle3 = messages.required;
  } else if (values.peaceTitle3.trim() == "") {
    errors.peaceTitle3 = messages.required;
  } else if (values.peaceTitle3 && values?.peaceTitle3?.length > inputTextLimit) {
    errors.peaceTitle3 = messages.inputTextLimitError;
  }

  if (!values.peaceContent3) {
    errors.peaceContent3 = messages.required;
  } else if (values.peaceContent3.trim() == "") {
    errors.peaceContent3 = messages.required;
  } else if (values.peaceContent3 && values?.peaceContent3?.length > inputDescLimit) {
    errors.peaceContent3 = messages.inputDescLimitError;
  }

  return errors
}

export default validate;