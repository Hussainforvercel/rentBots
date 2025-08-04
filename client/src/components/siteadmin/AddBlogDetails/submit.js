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
  mutation addBlogDetails(
    $metaTitle: String,
    $metaDescription: String,
    $pageUrl: String,
    $pageTitle: String,
    $content: String,
    $footerCategory: String,
  ) {
    addBlogDetails(
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

    if (data.addBlogDetails.status === "success") {
      showToaster({ messageId: 'addBlog', toasterType: 'success' })
      history.push('/siteadmin/content-management');
    }
    else if (data.addBlogDetails.status === 'URL exist') {
      showToaster({ messageId: 'addBlogFailed', toasterType: 'error' })
    }
    else {
      showToaster({ messageId: 'failedToCreateBlog', toasterType: 'error' })
    }
  }

}

export default submit;
