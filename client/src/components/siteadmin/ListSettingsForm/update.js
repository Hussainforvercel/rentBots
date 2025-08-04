// Fetch Request
import fetch from '../../../core/fetch';
// Redux
import { closeListSettingsModal } from '../../../actions/siteadmin/modalActions';
import { getAdminListingSettings } from '../../../actions/siteadmin/getAdminListingSettings';
import showToaster from '../../../helpers/toasterMessages/showToaster';

async function update(values, dispatch) {

  const query = `
    query (
        $id:Int,
        $typeId:Int,
        $itemName:String,
        $itemDescription:String,
        $otherItemName:String,
        $maximum:Int,
        $minimum:Int,
      	$startValue:Int,
        $endValue:Int,
        $isEnable: String,
        $makeType: String
      ) {
          updateListSettings (
            id: $id,
            typeId:$typeId,
            itemName:$itemName,
            itemDescription:$itemDescription,
            otherItemName: $otherItemName,
            maximum: $maximum,
            minimum: $minimum,
            startValue: $startValue,
            endValue: $endValue,
            isEnable: $isEnable,
            makeType: $makeType
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

  if (data?.updateListSettings?.status === "success") {
    dispatch(closeListSettingsModal());
    await dispatch(getAdminListingSettings(values.typeId));
    showToaster({ messageId: 'updateListSettings', toasterType: 'success' })
  } else if (data?.updateListSettings?.status === "unableToDisable") {
    showToaster({ messageId: 'checkActiveListing', toasterType: 'error' })
  } else if (data?.updateListSettings?.status === "listingUsed") {
    showToaster({ messageId: 'removeListSettings', toasterType: 'error' })
  } else if (data?.updateListSettings?.status === 'modelUsed') {
    showToaster({ messageId: 'removeModel', toasterType: 'error'})
  } else {
    showToaster({ messageId: 'updateListSettings', toasterType: 'error' })
  }
  dispatch(closeListSettingsModal());

}

export default update;
