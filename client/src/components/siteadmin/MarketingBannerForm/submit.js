import { toastr } from 'react-redux-toastr';

async function submit(values, dispatch, props) {
  const { updateMarketingBanner, id, image } = props;

  try {
    const { data } = await updateMarketingBanner({
      variables: {
        id,
        title: values.title,
        image: image,
        link: values.link
      }
    });

    if (data.updateMarketingBanner.status === 'success') {
      toastr.success('Success!', 'Marketing banner has been updated successfully!');
    } else {
      toastr.error('Error!', 'Failed to update marketing banner');
    }
  } catch (error) {
    toastr.error('Error!', 'Failed to update marketing banner');
    return false;
  }
}

export default submit; 