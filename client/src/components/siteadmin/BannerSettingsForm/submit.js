// Fetch Request
import fetch from '../../../core/fetch';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  const query = `
    query (
      $id: Int,
      $title: String,
      $content: String,
    ) {
      updateBannerSettings (
        id: $id,
        title: $title,
        content: $content,
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

  if (data.updateBannerSettings.status === "success") {
    showToaster({ messageId: 'updateBannerSettings', toasterType: 'success' })
  } else {
    showToaster({ messageId: 'updateBannerSettingsFailed', toasterType: 'error' })
  }

}

export default submit;
