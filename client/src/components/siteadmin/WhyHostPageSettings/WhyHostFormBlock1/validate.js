import messages from '../../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.hostBannerTitle1) {
    errors.hostBannerTitle1 = messages.required;
  } else if (values.hostBannerTitle1.trim() == "") {
    errors.hostBannerTitle1 = messages.required;
  } else if (values.hostBannerTitle1 && values?.hostBannerTitle1?.length > inputTextLimit) {
    errors.hostBannerTitle1 = messages.inputTextLimitError;
  }

  if (!values.hostBannerContent1) {
    errors.hostBannerContent1 = messages.required;
  } else if (values.hostBannerContent1.trim() == "") {
    errors.hostBannerContent1 = messages.required;
  } else if (values.hostBannerContent1 && values?.hostBannerContent1?.length > inputDescLimit) {
    errors.hostBannerContent1 = messages.inputDescLimitError;
  }

  if (!values.hostBannerContent2) {
    errors.hostBannerContent2 = messages.required;
  } else if (values.hostBannerContent2.trim() == "") {
    errors.hostBannerContent2 = messages.required;
  } else if (values.hostBannerContent2 && values?.hostBannerContent2?.length > inputTextLimit) {
    errors.hostBannerContent2 = messages.inputTextLimitError;
  }

  if(values.buttonLabel && values?.buttonLabel?.length > inputTextLimit) {
    errors.buttonLabel = messages.inputTextLimitError;
  }

  if(values.buttonLabel2 && values?.buttonLabel2?.length > inputTextLimit) {
    errors.buttonLabel2 = messages.inputTextLimitError;
  }

  return errors
}

export default validate;