import messages from '../../../locale/messages';

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = messages.required;
  }

  if (!values.link) {
    errors.link = messages.required;
  }

  return errors;
};

export default validate; 