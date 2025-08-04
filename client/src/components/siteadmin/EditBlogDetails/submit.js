// Fetch Request
import fetch from '../../../core/fetch';
import history from '../../../core/history';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {
  if (values.content == null || values.content == '<p><br></p>' || values.content == '<p> </p>') {
    showToaster({ messageId: 'addContent', toasterType: 'error' })
  }
  else {

    const mutation = `
  mutation updateBlogDetails(
    $id: Int,
    $metaTitle: String,
    $metaDescription: String,
    $pageUrl: String,
    $pageTitle: String,
    $content: String,
    $footerCategory: String,
  ) {
    updateBlogDetails(
      id: $id,
      metaTitle: $metaTitle,
      metaDescription: $metaDescription,
      pageUrl: $pageUrl,
      pageTitle: $pageTitle,
      content: $content,
      footerCategory: $footerCategory
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


    if (data.updateBlogDetails.status === "success") {
      showToaster({ messageId: 'updateBlogSuccess', toasterType: 'success' })
      history.push('/siteadmin/content-management');
    }
    else if (data.updateBlogDetails.status === 'URL exist') {
      showToaster({ messageId: 'addBlogFailed', toasterType: 'error' })
    }
    else {
      showToaster({ messageId: 'failedToUpdateBlog', toasterType: 'error' })
    }
  }

}

export default submit;
