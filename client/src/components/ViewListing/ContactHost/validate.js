import messages from '../../../locale/messages';
import { inputDescLimit } from '../../../helpers/fieldRestriction';
const validate = values => {

  const errors = {}

  if (!values.personCapacity) {
    errors.personCapacity = messages.required;
  }

  if (!values.content) {
    errors.content = messages.required;
  }else if (values.content && values.content.toString().trim() == '') {
    errors.content = messages.required;
  } else if (values.content && values?.content?.length > inputDescLimit) {
    errors.content = messages.inputDescLimitError;
  }
  
  return errors
}

export default validate
