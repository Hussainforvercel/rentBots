// Action
import { updateStaticPageAction } from '../../../actions/siteadmin/updateStaticPage';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {
  if (values.content == null || values.content == '<p><br></p>' || values.content == '<p> </p>') {
    showToaster({ messageId: 'addContent', toasterType: 'error' })
  } else if (values.metaTitle == null || values.metaTitle && values.metaTitle.trim() == '') {
    showToaster({ messageId: 'addMetaTitle', toasterType: 'error' })
  } else if (values.metaDescription == null || values.metaDescription && values.metaDescription.trim() == '') {
    showToaster({ messageId: 'addMetaDescription', toasterType: 'error' })
  } else {
    await dispatch(updateStaticPageAction(values));
  }

}

export default submit;
