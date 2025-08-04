import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {
  const errors = {}
  let colonValidation, questionCount, andCount;

  colonValidation = (!/^(?!.*:).*$/i.test(values?.buttonLink));
  questionCount = (values?.buttonLink?.match(/\?/g) || []).length;
  andCount = (values?.buttonLink?.match(/\&/g) || []).length;

  if (!values?.heading) {
    errors.heading = messages.required;
  } else if (values?.heading?.trim() == '') {
    errors.heading = messages.required;
  } else if (values?.heading?.length > inputTextLimit) {
    errors.heading = messages.inputTextLimitError;
  }

  if (!values?.buttonLabel) {
    errors.buttonLabel = messages.required;
  } else if (values?.buttonLabel.trim() == '') {
    errors.buttonLabel = messages.required;
  } else if (values?.buttonLabel?.length > inputTextLimit) {
    errors.buttonLabel = messages.inputTextLimitError;
  }

  if (!values?.buttonLink) {
    errors.buttonLink = messages.required;
  } else if (values?.buttonLink?.trim() == '') {
    errors.buttonLink = messages.required;
  } else if (questionCount >= 1 || andCount >= 1 || colonValidation) {
    errors.buttonLink = messages.invalidPageUrl;
  } else if (values?.buttonLink?.length > inputTextLimit) {
    errors.buttonLink = messages.inputTextLimitError;
  }

  if (!values?.content1) {
    errors.content1 = messages.required;
  } else if (values?.content1?.trim() == '') {
    errors.content1 = messages.required;
  } else if (values?.content1?.length > inputDescLimit) {
    errors.content1 = messages.inputDescLimitError;
  }

  if (!values?.content2) {
    errors.content2 = messages.required;
  } else if (values?.content2?.trim() == '') {
    errors.content2 = messages.required;
  } else if (values?.content2?.length > inputDescLimit) {
    errors.content2 = messages.inputDescLimitError;
  }

  if (!values?.content3) {
    errors.content3 = messages.required;
  } else if (values?.content3.trim() == '') {
    errors.content3 = messages.required;
  } else if (values?.content3?.length > inputDescLimit) {
    errors.content3 = messages.inputDescLimitError;
  }

  if (values?.content4?.trim() == '') {
    errors.content4 = messages.required;
  } else if (values?.content4?.length > inputDescLimit) {
    errors.content4 = messages.inputDescLimitError;
  }

  if (values?.content5?.trim() == '') {
    errors.content5 = messages.required;
  } else if (values?.content5?.length > inputDescLimit) {
    errors.content5 = messages.inputDescLimitError;
  }

  return errors
}

export default validate;