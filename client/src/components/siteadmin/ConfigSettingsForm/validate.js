import messages from '../../../locale/messages';
import { inputDescLimit, inputTextLimit } from "../../../helpers/fieldRestriction";

const validate = values => {

  const errors = {}

  if (!values?.deepLinkBundleId || values?.deepLinkBundleId.toString().trim() == "") errors.deepLinkBundleId = messages.required;
  else if (values?.deepLinkBundleId?.length > inputTextLimit) errors.deepLinkBundleId = messages.inputTextLimitError;

  if (!values?.smtpHost || values?.smtpHost.toString().trim() == "") errors.smtpHost = messages.required;
  else if (values?.smtpHost?.length > inputTextLimit) errors.smtpHost = messages.inputTextLimitError;

  if (!values?.smtpPort || values?.smtpPort.toString().trim() == "") errors.smtpPort = messages.required;
  if (values?.smtpPort && isNaN(values?.smtpPort)) errors.smtpPort = messages.onlyNumericKey;
  if (values?.smtpPort?.length > inputTextLimit) errors.smtpPort = messages.inputTextLimitError;

  if (!values?.smptEmail || values?.smptEmail.toString().trim() == "") errors.smptEmail = messages.required && messages.required;
  else if (values?.smptEmail?.length > inputTextLimit) errors.smptEmail = messages.inputTextLimitError;

  if (!values?.smtpSender || values?.smtpSender.toString().trim() == "") errors.smtpSender = messages.required;
  else if (values?.smtpSender?.length > inputTextLimit) errors.smtpSender = messages.inputTextLimitError;

  if (!values?.smtpPassWord || values?.smtpPassWord.toString().trim() == "") errors.smtpPassWord = messages.required;
  else if (values?.smtpPassWord?.length > inputTextLimit) errors.smtpPassWord = messages.inputTextLimitError;

  if (!values?.smtpSenderEmail) {
    errors.smtpSenderEmail = messages.required && messages.required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(values?.smtpSenderEmail)) {
    errors.smtpSenderEmail = messages.emailInvalid && messages.emailInvalid;
  }

  if (!values?.twillioAccountSid || values?.twillioAccountSid.toString().trim() == "") errors.twillioAccountSid = messages.required;
  else if (values?.twillioAccountSid?.length > inputTextLimit) errors.twillioAccountSid = messages.inputTextLimitError;

  if (!values?.twillioAuthToken || values?.twillioAuthToken.toString().trim() == "") errors.twillioAuthToken = messages.required;
  else if (values?.twillioAuthToken?.length > inputTextLimit) errors.twillioAuthToken = messages.inputTextLimitError;

  if (!values?.twillioPhone || values?.twillioPhone && values?.twillioPhone.toString().trim() == "") {
    errors.twillioPhone = messages.required && messages.required;
  } else if (values?.twillioPhone.length > 30) {
    errors.twillioPhone = messages.phoneNumberLengthInvalid;
  }

  if (!values?.paypalClientId || values?.paypalClientId.toString().trim() == "") errors.paypalClientId = messages.required;
  else if (values?.paypalClientId?.length > inputTextLimit) errors.paypalClientId = messages.inputTextLimitError;

  if (!values?.paypalSecret || values?.paypalSecret.toString().trim() == "") errors.paypalSecret = messages.required;
  else if (values?.paypalSecret?.length > inputTextLimit) errors.paypalSecret = messages.inputTextLimitError;

  if (!values?.paypalHost || values?.paypalHost.toString().trim() == "") {
    errors.paypalHost = messages.required;
  } else if (values?.paypalHost && !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(values.paypalHost)) {
    errors.paypalHost = messages.urlInvalid;
  }

  if (!values?.stripePublishableKey || values?.stripePublishableKey.toString().trim() == "") errors.stripePublishableKey = messages.required;
  else if (values?.stripePublishableKey?.length > inputTextLimit) errors.stripePublishableKey = messages.inputTextLimitError;

  if (!values?.maxUploadSize || values?.maxUploadSize.toString().trim() == "") errors.maxUploadSize = messages.required;
  
  if (!values?.deepLinkContent || values?.deepLinkContent.toString().trim() == "") errors.deepLinkContent = messages.required;
  else if (values?.deepLinkContent?.length > inputDescLimit) errors.deepLinkContent = messages.inputDescLimitError;

  if (!values?.facebookAppId || values?.facebookAppId.toString().trim() == "") errors.facebookAppId = messages.required;
  else if (values?.facebookAppId?.length > inputTextLimit) errors.facebookAppId = messages.inputTextLimitError;

  if (!values?.facebookSecretId || values?.facebookSecretId.toString().trim() == "") errors.facebookSecretId = messages.required;
  else if (values?.facebookSecretId?.length > inputTextLimit) errors.facebookSecretId = messages.inputTextLimitError;

  if (!values?.googleClientId || values?.googleClientId.toString().trim() == "") errors.googleClientId = messages.required;
  else if (values?.googleClientId?.length > inputTextLimit) errors.googleClientId = messages.inputTextLimitError;

  if (!values?.googleSecretId || values?.googleSecretId.toString().trim() == "") errors.googleSecretId = messages.required;
  else if (values?.googleSecretId?.length > inputTextLimit) errors.googleSecretId = messages.inputTextLimitError;

  if (!values?.fcmPushNotificationKey || values?.fcmPushNotificationKey.toString().trim() == "") errors.fcmPushNotificationKey = messages.required;
  else if (values?.fcmPushNotificationKey?.length > inputDescLimit) errors.fcmPushNotificationKey = messages.inputDescLimitError;

  return errors;
}

export default validate;
