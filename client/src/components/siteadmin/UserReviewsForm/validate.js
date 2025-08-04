import messages from '../../../locale/messages';
import { inputDescLimit } from '../../../helpers/fieldRestriction';

const validate = values => {

    const errors = {}

    // if (!values.listId) {
    //     errors.listId = 'Provide list ID';
    // } else if (isNaN(values.listId)) {
    //     errors.listId = 'Only numeric values are allowed';
    // }

    if (!values.reviewContent) {
        errors.reviewContent = messages.reviewError1;
    } else if (values?.reviewContent?.length > inputDescLimit) {
        errors.reviewContent = messages.inputDescLimitError;
    }

    if (!values.rating) {
        errors.rating = messages.reviewError2;
    }

    return errors
}

export default validate;