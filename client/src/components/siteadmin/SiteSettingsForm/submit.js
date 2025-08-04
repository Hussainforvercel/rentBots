// Fetch Request
import fetch from '../../../core/fetch';
import showToaster from '../../../helpers/toasterMessages/showToaster'
import { setSiteSettings } from '../../../actions/siteSettings';

async function submit(values, dispatch) {

  if (!values?.ogImage) {
    return showToaster({ messageId: 'ogImageError', toasterType: 'error' })
  }

  values.appAvailableStatus = Number(values?.appAvailableStatus);
  const query = `
  query (
    $siteName: String,
    $siteTitle: String,
    $metaDescription: String,
    $metaKeyword: String,
    $logo: String,
    $facebookLink: String,
    $twitterLink: String,
    $instagramLink: String
    $homePageType: Int,
    $phoneNumberStatus: Int,
    $appAvailableStatus: Boolean,
    $playStoreUrl: String,
    $appStoreUrl: String,
    $email: String,
    $phoneNumber: String,
    $address: String,
    $appForceUpdate: String,
    $androidVersion: String,
    $iosVersion: String,
    $ogImage: String,
    $securityDepositPreference: Int,
    $ButtonColor: String
  ) {
    updateSiteSettings (
      siteName: $siteName,
      siteTitle: $siteTitle,
      metaDescription: $metaDescription,
      metaKeyword: $metaKeyword,
      logo: $logo,
      facebookLink: $facebookLink,
      twitterLink: $twitterLink,
      instagramLink: $instagramLink,
      homePageType: $homePageType,
      phoneNumberStatus: $phoneNumberStatus,
      appAvailableStatus: $appAvailableStatus,
      playStoreUrl: $playStoreUrl,
      appStoreUrl: $appStoreUrl,
      email: $email,
      phoneNumber: $phoneNumber,
      address: $address,
      appForceUpdate: $appForceUpdate,
      androidVersion: $androidVersion,
      iosVersion: $iosVersion,
      ogImage: $ogImage,
      securityDepositPreference: $securityDepositPreference,
      ButtonColor: $ButtonColor
    ) {
        status
    }
  }
  `;

  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: values
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();
  if (data?.updateSiteSettings?.status === "success") {
    showToaster({ messageId: 'settingsUpdate', toasterType: 'success' })
    dispatch(setSiteSettings());

  } else {
    showToaster({ messageId: 'settingsUpdateFailed', toasterType: 'error' })
  }

}

export default submit;
