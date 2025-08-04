import { updateReview } from '../../../../actions/siteadmin/WhyHostReview/deleteWhyHostReview';
import showToaster from '../../../../helpers/toasterMessages/showToaster';

async function submit(values, dispatch) {

  if (values.image == null) {
    showToaster({ messageId: 'uploadImage', toasterType: 'error' })
    return;
  }

  dispatch(updateReview(values));

}

export default submit;
