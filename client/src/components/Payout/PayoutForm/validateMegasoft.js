import messages from '../../../locale/messages';

const validate = (values) => {
  const errors = {};

  if (!values.accountType) {
    errors.accountType = 'Account type is required';
  }

  if (!values.firstName) {
    errors.firstName = 'First name is required';
  } else if (values.firstName.trim() == '') {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  } else if (values.lastName.trim() == '') {
    errors.lastName = 'Last name is required';
  }

  if (!values.accountName) {
    errors.accountName = 'Account number is required';
  } else if (values.accountName.trim() == '') {
    errors.accountName = 'Account number is required';
  }

  if (!values.confirmAccountName) {
    errors.confirmAccountName = 'Confirm account number is required';
  } else if (values.confirmAccountName.trim() == '') {
    errors.confirmAccountName = 'Confirm account number is required';
  } else if (values.accountName && values.confirmAccountName && values.accountName !== values.confirmAccountName) {
    errors.confirmAccountName = 'Account number and confirm account number do not match';
  }

  return errors;
};

export default validate; 