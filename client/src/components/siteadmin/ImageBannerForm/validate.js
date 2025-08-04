import messages from '../../../locale/messages';
import { andValidation, colonValidation, questionValidation } from '../../../helpers/regexHelper';
import { inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  let colonUrlValidation1, questionValidation1, andValidation1, colonUrlValidation2, questionValidation2, andValidation2;

  colonUrlValidation1 = (!colonValidation.test(values?.buttonLink1));
  questionValidation1 = (values?.buttonLink1?.match(questionValidation))?.length;
  andValidation1 = (values?.buttonLink1?.match(andValidation))?.length;

  colonUrlValidation2 = (!colonValidation.test(values?.buttonLink2));
  questionValidation2 = (values?.buttonLink2?.match(questionValidation))?.length;
  andValidation2 = (values?.buttonLink2?.match(andValidation))?.length;

  if (!values?.title) {
    errors.title = messages.required;
  } else if (values?.title?.trim() == '') {
    errors.title = messages.required;
  } else if (values?.title?.length > inputTextLimit) {
    errors.title = messages.inputTextLimitError;
  }

  if (!values?.buttonLabel) {
    errors.buttonLabel = messages.required;
  } else if (values?.buttonLabel?.trim() == '') {
    errors.buttonLabel = messages.required;
  } else if (values?.buttonLabel?.length > inputTextLimit) {
    errors.buttonLabel = messages.inputTextLimitError;
  }

  if (!values?.buttonLabel2) {
    errors.buttonLabel2 = messages.required;
  } else if (values?.buttonLabel2?.trim() == '') {
    errors.buttonLabel2 = messages.required;
  } else if (values.buttonLabel2?.length > inputTextLimit) {
    errors.buttonLabel2 = messages.inputTextLimitError;
  }

  if (!values?.buttonLink1) {
    errors.buttonLink1 = messages.required;
  } else if (questionValidation1 >= 1 || andValidation1 >= 1 || colonUrlValidation1) {
    errors.buttonLink1 = messages.invalidPageUrl;
  }

  if (!values?.buttonLink2) {
    errors.buttonLink2 = messages.required;
  } else if (questionValidation2 >= 1 || andValidation2 >= 1 || colonUrlValidation2) {
    errors.buttonLink2 = messages.invalidPageUrl;
  }

  return errors
}

export default validate