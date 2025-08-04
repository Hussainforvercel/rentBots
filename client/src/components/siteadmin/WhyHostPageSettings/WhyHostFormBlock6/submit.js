import fetch from '../../../../core/fetch';
import showToaster from '../../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {
  const query = `
  mutation (
    $peaceTitleHeading: String,
    $peaceTitle3: String,
    $peaceContent3: String
) {
  updateWhyHostPage (
    peaceTitleHeading: $peaceTitleHeading,
    peaceTitle3: $peaceTitle3,
    peaceContent3: $peaceContent3
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

  if (data.updateWhyHostPage.status === "success") {
    showToaster({ messageId: 'updateWhyHostPage', toasterType: 'success' })
  } else {
    showToaster({ messageId: 'updateWhyHostPageFailed', toasterType: 'error' })
  }

}

export default submit;
