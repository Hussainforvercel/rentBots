// Fetch Request
import fetch from '../../../core/fetch';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  if (!values.carTripImage1 || !values.carTripImage2) {
    showToaster({ messageId: 'blockSettingsFailed', toasterType: 'error' })
    return;
  }

  const mutation = `
    mutation (
        $carTripTitle1: String,
        $carTripTitle2: String,
        $carTripContent2: String,
        $carTripTitle3: String,
        $carTripContent3: String
    ) {
      updateStaticInfoBlock (
        carTripTitle1: $carTripTitle1,
        carTripTitle2: $carTripTitle2,
        carTripContent2: $carTripContent2,
        carTripTitle3: $carTripTitle3,
        carTripContent3: $carTripContent3
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
      query: mutation,
      variables: values
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();

  if (data.updateStaticInfoBlock.status === "success") {
    showToaster({ messageId: 'blockSettingsUpdate', toasterType: 'success' })
  } else {
    showToaster({ messageId: 'blockSettingsFailed', toasterType: 'error' })
  }

}

export default submit;
