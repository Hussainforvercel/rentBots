// Fetch Request
import fetch from '../../../core/fetch';
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster';
async function submit(values, dispatch) {

  const mutation = `
  mutation updatePopularLocation(
    $id: Int,
    $location: String,
    $locationAddress: String,
    $image: String,
  ) {
    updatePopularLocation(
      id: $id,
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


  if (data.updatePopularLocation.status === "success") {
    showToaster({ messageId: 'updatePopularLocation', toasterType: 'success' })
    history.push('/siteadmin/popularlocation');
  } else {
    showToaster({ messageId: 'updatePopularLocationFailed', toasterType: 'error' })
  }

}

export default submit;
