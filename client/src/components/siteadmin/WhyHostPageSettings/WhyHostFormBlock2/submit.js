import fetch from '../../../../core/fetch';
import showToaster from '../../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {
  const query = `
  mutation (
    $earnBlockTitle1: String,
    $earnBlockContent1: String,
) {
  updateWhyHostPage (
    earnBlockTitle1: $earnBlockTitle1,
    earnBlockContent1: $earnBlockContent1,
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

  if (data?.updateWhyHostPage?.status === "success") {
    showToaster({ messageId: 'updateWhyHostPage', toasterType: 'success' })
  } else {
    showToaster({ messageId: 'updateWhyHostPageFailed', toasterType: 'error' })
  }

}

export default submit;
