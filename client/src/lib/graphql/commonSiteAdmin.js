import { gql } from 'react-apollo';

export const updateConfigSettingsMutation = gql`mutation updateConfigSettings(
        $deepLinkBundleId: String,
        $smtpHost: String,
        $smtpPort: String,
        $smptEmail: String,
        $smtpSender: String,
        $smtpSenderEmail: String,
        $smtpPassWord: String,
        $twillioAccountSid: String,
        $twillioAuthToken: String,
        $twillioPhone: String,
        $paypalClientId: String,
        $paypalSecret: String,
        $paypalHost: String,
        $maxUploadSize: String,
        $stripePublishableKey: String,
        $facebookAppId: String,
        $facebookSecretId: String,
        $googleClientId: String,
        $googleSecretId: String,
        $deepLinkContent: String,
        $fcmPushNotificationKey: String,
        $livechat: String,
        $showchat: Boolean,
        $merchentID: String,
        $username: String,
        $password: String,
        $Token: String
    ) {
        updateConfigSettings(
            deepLinkBundleId: $deepLinkBundleId,
            smtpHost: $smtpHost,
            smtpPort: $smtpPort,
            smptEmail: $smptEmail,
            smtpSender: $smtpSender,
            smtpSenderEmail: $smtpSenderEmail,
            smtpPassWord: $smtpPassWord,
            twillioAccountSid: $twillioAccountSid,
            twillioAuthToken: $twillioAuthToken,
            twillioPhone: $twillioPhone,
            paypalClientId: $paypalClientId,
            paypalSecret: $paypalSecret,
            paypalHost: $paypalHost,
            maxUploadSize: $maxUploadSize,
            stripePublishableKey: $stripePublishableKey,
            facebookAppId: $facebookAppId,
            facebookSecretId: $facebookSecretId,
            googleClientId: $googleClientId,
            googleSecretId: $googleSecretId,
            deepLinkContent: $deepLinkContent,
            fcmPushNotificationKey: $fcmPushNotificationKey,
            livechat: $livechat,
            showchat: $showchat,
            merchentID: $merchentID,
            username: $username,
            password: $password,
            Token: $Token
        ){
            status
            errorMessage
        }
    }`;

export const makeModelCsvUploaderMutation = gql`mutation makeModelCsvUploader($csvValue: [[String]]!) {
     makeModelCsvUploader(csvValue: $csvValue) {
       status
       errorMessage
       result {
         duplicateDatas
         isUploadedCsv
         make
         model
       }
     }
   }`

export const getSiteSettings = gql`
  query getSiteSettings {
    getSiteSettings {
      id
      title
      name
      value
      type
      status
    }
  }
`;

export const siteSettings = gql`
    query ($type: String) {
      siteSettings(type: $type) {
        name
        value
      }
    }
    `;

export const content = `
    query($path:String!,$locale:String!) {
      content(path:$path,locale:$locale) {
        title, content,
      }
    }
    `;