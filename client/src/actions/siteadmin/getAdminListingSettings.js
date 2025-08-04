import {
  ADMIN_LOAD_LIST_SETTINGS_START,
  ADMIN_LOAD_LIST_SETTINGS_SUCCESS,
  ADMIN_LOAD_LIST_SETTINGS_ERROR
} from '../../constants';
import { getAllAdminListSettings as query } from '../../lib/graphql';

export const getAdminListingSettings = (typeId, page) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: ADMIN_LOAD_LIST_SETTINGS_START
      });

      let currentPage = page ? page : 1;

      const { data } = await client.query({
        query,
        variables: { typeId, currentPage },
        fetchPolicy: 'network-only'
      });

      if (data?.getAllAdminListSettings) {
        dispatch({
          type: ADMIN_LOAD_LIST_SETTINGS_SUCCESS,
          payload: {
            adminListSettingsData: data,
            currentPage
          }
        });
      } else {
        dispatch({
          type: ADMIN_LOAD_LIST_SETTINGS_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: ADMIN_LOAD_LIST_SETTINGS_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
