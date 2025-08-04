import {
  DELETE_LIST_SETTINGS_START,
  DELETE_LIST_SETTINGS_SUCCESS,
  DELETE_LIST_SETTINGS_ERROR,
  CLOSE_LIST_SETTINGS_MODAL
} from '../../constants';
import { getAdminListingSettings } from './getAdminListingSettings';
import { closeListSettingsModal } from './modalActions';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { deleteListSettings as query } from '../../lib/graphql';

export const deleteListSettings = (id, typeId, page) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: DELETE_LIST_SETTINGS_START,
      });

      const { data } = await client.query({
        query,
        variables: { id, typeId },
        fetchPolicy: 'network-only'
      });

      if (data?.deleteListSettings) {
        if (data?.deleteListSettings?.status === "success") {
          dispatch({
            type: CLOSE_LIST_SETTINGS_MODAL,
          });
          dispatch({
            type: DELETE_LIST_SETTINGS_SUCCESS,
          });

          showToaster({ messageId: 'deleteListing', toasterType: 'success' })

          dispatch(getAdminListingSettings(typeId, page));
        } else {
          if (data?.deleteListSettings?.status === "unableToDisable") {
            showToaster({ messageId: 'unableToDisableListSetting', toasterType: 'error' })
          } else if (data?.deleteListSettings?.status === "listingUsed") {
            showToaster({ messageId: 'unableToDeleteListSetting', toasterType: 'error' })
          } else if (data?.deleteListSettings?.status === "modelUsed") {
            showToaster({ messageId: 'listSettingModelUsed', toasterType: 'error' })
          } else {
            showToaster({ messageId: 'updateListSettings', toasterType: 'error' })
          }
          dispatch(closeListSettingsModal());
          dispatch({
            type: DELETE_LIST_SETTINGS_ERROR,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: DELETE_LIST_SETTINGS_ERROR,
        payload: {
          error
        }
      });
    }
  };
}
