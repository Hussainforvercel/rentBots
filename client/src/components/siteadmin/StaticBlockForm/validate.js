import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.carTripTitle1) {
    errors.carTripTitle1 = messages.required;
  } else if(values.carTripTitle1 && values.carTripTitle1.trim() == '') {
    errors.carTripTitle1 = messages.required;
  } else if(values.carTripTitle1 && values?.carTripTitle1?.length > inputTextLimit) {
    errors.carTripTitle1 = messages.inputTextLimitError;
  }

  if (!values.carTripTitle2) {
    errors.carTripTitle2 = messages.required;
  } else if(values.carTripTitle2 && values.carTripTitle2.trim() == '') {
    errors.carTripTitle2 = messages.required;
  } else if(values.carTripTitle2 && values?.carTripTitle2?.length > inputTextLimit) {
    errors.carTripTitle2 = messages.inputTextLimitError;
  }

  if (!values.carTripTitle3) {
    errors.carTripTitle3 = messages.required;
  } else if(values.carTripTitle3 && values.carTripTitle3.trim() == '') {
    errors.carTripTitle3 = messages.required;
  } else if(values.carTripTitle3 && values?.carTripTitle3?.length > inputTextLimit) {
    errors.carTripTitle3 = messages.inputTextLimitError;
  }

  if (!values.carTripContent2) {
    errors.carTripContent2 = messages.required;
  } else if(values.carTripContent2 && values.carTripContent2.trim() == '') {
    errors.carTripContent2 = messages.required;
  } else if(values.carTripContent2 && values?.carTripContent2?.length > inputDescLimit) {
    errors.carTripContent2 = messages.inputDescLimitError;
  }

  if (!values.carTripContent3) {
    errors.carTripContent3 = messages.required;
  } else if(values.carTripContent3 && values.carTripContent3.trim() == '') {
    errors.carTripContent3 = messages.required;
  } else if(values.carTripContent3 && values?.carTripContent3?.length > inputDescLimit) {
    errors.carTripContent3 = messages.inputDescLimitError;
  }
  

  return errors
}

export default validate;