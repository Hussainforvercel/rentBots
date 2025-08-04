import messages from '../../locale/messages';
import { inputDescLimit, inputTextLimit, validateEmail } from '../../helpers/fieldRestriction';
const validate = values => {

   const errors = {}

   if (!values.name || values.name.trim() == "") {
      errors.name = messages.required;
   } else if (values?.name?.length > inputTextLimit) {
      errors.name = messages.inputTextLimitError;
   }

   if (!values.email) {
      errors.email = messages.required;
   } else if (validateEmail(values.email)) {
      errors.email = messages.emailInvalid;
   }

   if (!values.phoneNumber || values.phoneNumber?.toString()?.trim() == "") {
      errors.phoneNumber = messages.required;
   } else if (values.phoneNumber && !/^[0-9 !-#$%^&*+)(]{2,20}$/.test(values.phoneNumber)) {
      errors.phoneNumber = messages.required;
   }

   if (!values.contactMessage || values.contactMessage.trim() == "") {
      errors.contactMessage = messages.required;
   } else if (values?.contactMessage?.length > inputDescLimit) {
      errors.contactMessage = messages.inputDescLimitError;
   }

   if (!values.reCaptcha) {
      errors.reCaptcha = messages.required;
   }
   return errors
}
export default validate
