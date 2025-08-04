import messages from '../../../locale/messages';
import { inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {}

  if (!values.address1 || (values.address1 && values.address1.toString().trim() == '')) {
    errors.address1 = messages.required;
  } else if (values?.address1?.length > inputTextLimit) {
    errors.address1 = messages.inputTextLimitError;
  }

  if(values?.address2?.length > inputTextLimit) {
    errors.address2 = messages.inputTextLimitError;
  }

  if (!values.country) {
    errors.country = messages.required;
  }

  if (!values.city || (values.city && values.city.toString().trim() == '')) {
    errors.city = messages.required;
  } else if (values?.city?.length > inputTextLimit) {
    errors.city = messages.inputTextLimitError; 
  }

  if (!values.state || (values.state && values.state.toString().trim() == '')) {
    errors.state = messages.required;
  } else if (values?.state?.length > inputTextLimit) {
    errors.state = messages.inputTextLimitError;
  }

  if (!values.zipcode) { // Optional
    errors.zipcode = messages.required;
  }

  if (!values.payEmail) {
    errors.payEmail = messages.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.payEmail)) {
    errors.payEmail = messages.payoutError5;
  }
  if (!values.currency) {
    errors.currency = messages.required;
  }

  return errors
}

export default validate;