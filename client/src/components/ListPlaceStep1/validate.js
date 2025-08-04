import messages from '../../locale/messages';
import { inputTextLimit } from '../../helpers/fieldRestriction';


const validate = values => {

  const errors = {}

  if (!values.make) {
    errors.make = messages.required;
  }

  if (!values.model) {
    errors.model = messages.required;
  }

  if (!values.year) {
    errors.year = messages.required;
  }

  if (!values.carType) {
    errors.carType = messages.required;
  }

  if (!values.odometer) {
    errors.odometer = messages.required;
  }

  if (!values.transmission) {
    errors.transmission = messages.required;
  }

  if (!values.country || values.country.toString().trim() == "") {
    errors.country = messages.required;
  }

  if (!values.state || values.state.toString().trim() == "") {
    errors.state = messages.required;
  } else if (values?.state?.length > inputTextLimit) {
    errors.state = messages.inputTextLimitError;
  }

  if (!values.city || values.city.toString().trim() == "") {
    errors.city = messages.required;
  } else if (values?.city?.length > inputTextLimit) {
    errors.city = messages.inputTextLimitError;
  }

  if (!values.street || values.street.toString().trim() == "") {
    errors.street = messages.required;
  } else if (values?.street?.length > inputTextLimit) {
    errors.street = messages.inputTextLimitError;
  }

  if (values.zipcode && values.zipcode.toString().trim() == "") {
    errors.zipcode = messages.required;
  }

  if (values?.buildingName?.length > inputTextLimit) {
    errors.buildingName = messages.inputTextLimitError;
  }

  return errors
}

export default validate
