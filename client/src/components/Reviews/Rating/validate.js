import { inputDescLimit, inputTextLimit } from '../../../helpers/fieldRestriction';
import messages from '../../../locale/messages';

const validate = values => {

    const errors = {};

    if (!values.reviewContent) {
        errors.reviewContent = messages.required;
    } else if (values.reviewContent.trim() == "") {
        errors.reviewContent = messages.required;
    } else if (values?.reviewContent?.length > inputDescLimit) {
        errors.reviewContent = messages.inputDescLimitError;
    }

    if (!values.rating) {
        errors.rating = messages.required;
    }

    return errors;
};

export default validate;
