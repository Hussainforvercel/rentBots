import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit, validateEmail } from '../../../helpers/fieldRestriction';

const validate = values => {

  const errors = {};

  if (!values.siteName || values.siteName.toString().trim() === '') {
    errors.siteName = messages.required;
  } else if (values?.siteName?.length > inputTextLimit) {
    errors.siteName = messages.inputTextLimitError
  }

  if (!values.siteTitle || values.siteTitle.toString().trim() === '') {
    errors.siteTitle = messages.required;
  } else if (values?.siteTitle?.length > inputTextLimit) {
    errors.siteTitle = messages.inputTextLimitError
  }

  if (values.metaDescription && values.metaDescription.toString().trim() === '') errors.metaDescription = messages.invalid;
  else if (values.metaDescription && values?.metaDescription?.length > inputDescLimit) errors.metaDescription = messages.inputDescLimitError && messages.inputDescLimitError;

  if (values.metaKeyword && values.metaKeyword.toString().trim() === '') errors.metaKeyword = messages.invalid;
  else if (values.metaKeyword && values?.metaKeyword?.length > inputDescLimit) errors.metaKeyword = messages.inputDescLimitError && messages.inputDescLimitError;

  if ((!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.playStoreUrl))) errors.playStoreUrl = messages.urlInvalid;

  if ((!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.appStoreUrl))) errors.appStoreUrl = messages.urlInvalid;

  if (!values.email) errors.email = messages.required;
  else if (validateEmail(values.email)) errors.email = messages.emailInvalid && messages.emailInvalid;

  if (!values.phoneNumber || values.phoneNumber.toString().trim() === "") errors.phoneNumber = messages.required;
  else if (values.phoneNumber.length > 30) errors.phoneNumber = messages.phoneNumberLengthInvalid;

  if (!values.address || values.address.toString().trim() === '') errors.address = messages.required;
  else if (values?.address?.length > inputDescLimit) errors.address = messages.inputDescLimitError;

  if (values.facebookLink && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.facebookLink)) errors.facebookLink = messages.urlInvalid;

  if (values.twitterLink && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.twitterLink)) errors.twitterLink = messages.urlInvalid;

  if (values.instagramLink && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.instagramLink)) errors.instagramLink = messages.urlInvalid;

  if (!values.androidVersion || values.androidVersion.toString().trim() === '') errors.androidVersion = messages.required;
  else if (values.androidVersion && !/^\d+(\.\d+){0,2}$/i.test(values.androidVersion)) errors.androidVersion = messages.invalid;

  if (!values.iosVersion || values.iosVersion.trim() == '') errors.iosVersion = messages.required
  else if (values.iosVersion && !/^\d+(\.\d+){0,2}$/i.test(values.iosVersion)) errors.iosVersion = messages.invalid;

  return errors;
}

export default validate;
