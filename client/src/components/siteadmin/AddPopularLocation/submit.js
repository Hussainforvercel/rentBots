// Fetch Request
import fetch from '../../../core/fetch';
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {


  if (values.image == null) {
    showToaster({ messageId: 'addLocationImage', toasterType: 'error' })
  }
  else {
    const mutation = `
  mutation addPopularLocation(
    $location: String,
    $locationAddress: String,
    $image: String,
  ) {
    addPopularLocation(
      location: $location,
      locationAddress: $locationAddress,
      image: $image,
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


    if (data.addPopularLocation.status === "success") {
      showToaster({ messageId: 'addedLocation', toasterType: 'success' })
      history.push('/siteadmin/popularlocation');
    } else {
      showToaster({ messageId: 'addedLocationFailed', toasterType: 'error' })
    }
  }

}

export default submit;
