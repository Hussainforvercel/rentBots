// Redux Form
import { SubmissionError } from 'redux-form';

// Language
import { FormattedMessage } from 'react-intl';

// Fetch request
import fetch from '../../core/fetch';
// Redux
import { setRuntimeVariable } from '../../actions/runtime';
import { setUserLogout } from '../../actions/logout';

import { loadAccount } from '../../actions/account';
// Helper
import PopulateData from '../../helpers/populateData';

// Locale
import messages from '../../locale/messages';
import showToaster from '../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {


  let today, birthDate, age, monthDifference, dateOfMonth, dobDate;
  dateOfMonth = Number(values.month) + 1;
  dobDate = values.year + '/' + dateOfMonth + '/' + values.day;


  if (!values.day) {
    showToaster({ messageId: 'checkDay', toasterType: 'error' })
    return false;
  }

  if (!values.year) {
    showToaster({ messageId: 'checkYear', toasterType: 'error' })
    return false;
  }

  let monthValidation = parseInt(values.month);
  if (isNaN(monthValidation)) {
    showToaster({ messageId: 'checkMonth', toasterType: 'error' })
    return false;
  }

  today = new Date();
  birthDate = new Date(dobDate);
  age = today.getFullYear() - birthDate.getFullYear();
  monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
  if (age < 18) {
    showToaster({ messageId: 'checkAge', toasterType: 'error' })
    return false;
  }

  if (values.year && values.month && values.day) {
    if (!PopulateData.isValidDate(values.year, values.month, values.day)) {
      showToaster({ messageId: 'invalidDateOfBirth', toasterType: 'error' })
      return false;
    }
  }

  const query = `
  query (
    $firstName:String,
    $lastName:String,
  	$gender: String,
    $dateOfBirth: String,
    $email: String!,
  	$phoneNumber: String,
  	$preferredLanguage: String,
  	$preferredCurrency: String,
  	$location: String,
    $info: String,
    $loggedinEmail: String,
    $countryCode: String,
    $countryName: String,
  ) {
      userEditProfile (
        firstName:$firstName,
        lastName:$lastName,
        gender: $gender,
        dateOfBirth: $dateOfBirth,
        email: $email,
        phoneNumber: $phoneNumber,
        preferredLanguage: $preferredLanguage,
        preferredCurrency: $preferredCurrency,
        location: $location,
        info: $info,
        loggedinEmail: $loggedinEmail,
        countryCode: $countryCode,
        countryName: $countryName,
      ) {
        status
      }
    }
    `;

  const { year, month, day } = values;
  let dateOfBirth = (Number(month) + 1) + "-" + year + "-" + day;

  let firstNameValue = values.firstName ? values.firstName.trim() : values.firstName;
  let lastNameValue = values.lastName ? values.lastName.trim() : values.lastName;
  let phoneNumber = values.phoneNumber ? values.phoneNumber.trim() : values.phoneNumber;
  let location = values.location ? values.location.trim() : values.location;
  let infoValue = values.info ? values.info.trim() : values.info;
  let loggedinEmailValue = values.loggedinEmail ? values.loggedinEmail.trim() : values.loggedinEmail;
  let countryCode = values.phoneDialCode ? values.phoneDialCode : values.dialCode;
  let countryName = values.phoneCountryCode ? values.phoneCountryCode : null;

  const params = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    gender: values.gender,
    dateOfBirth: dateOfBirth,
    email: values.email,
    preferredLanguage: values.preferredLanguage,
    preferredCurrency: values.preferredCurrency,
    location: location,
    info: infoValue,
    phoneNumber: values.phoneNumber,
    loggedinEmail: loggedinEmailValue,
    countryCode: countryCode,
    countryName: countryName
  };
  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: params
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data.userEditProfile.status == "success") {
    await dispatch(loadAccount());
    showToaster({ messageId: 'updateProfile', toasterType: 'success' })
  } else if (data.userEditProfile.status == "email") {
    //throw new SubmissionError({ _error: messages.emailAlreadyExists });

    showToaster({ messageId: 'emailAlreadyExist', toasterType: 'error' })
  } else if (data.userEditProfile.status == "notLoggedIn") {
    dispatch(setRuntimeVariable({
      name: 'isAuthenticated',
      value: false,
    }));

    showToaster({ messageId: 'loginUser', toasterType: 'error' })
    //throw new SubmissionError({ _error: messages.notLoggedIn });
  } else {
    // throw new SubmissionError({ _error: messages.somethingWentWrong });

    showToaster({ messageId: 'reloadPage', toasterType: 'error' })
  }

}

export default submit;
