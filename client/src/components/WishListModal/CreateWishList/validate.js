import messages from '../../../locale/messages';
import { inputTextLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

    const errors = {}

    if (!values.name) {
        errors.name = messages.required;
    } else if (values.name.trim() == "") {
        errors.name = messages.required;
    } else if (values?.name?.length > inputTextLimit) {
        errors.name = messages.inputTextLimitError;
    }

    return errors
}

export default validate
