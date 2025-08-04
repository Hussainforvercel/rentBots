import messages from "../../locale/messages";

const validate = values => {

  const errors = {}

  if (!values.message) {
    errors.message = messages.required;
  }

  if (!values.paymentCurrency) {
    errors.paymentCurrency = messages.required;
  }

  return errors;
}

export default validate;