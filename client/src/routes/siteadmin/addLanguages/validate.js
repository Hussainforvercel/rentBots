import messages from '../../../locale/messages';

const validate = (values) => {
    const errors = {};

    if (!values.title) {
        errors.title = messages.required;
    }

    if (!values.code) {
        errors.code = messages.required;
    } else if (values.code.length !== 2) {
        errors.code = messages.languageCodeLength;
    }

    return errors;
};

export default validate; 