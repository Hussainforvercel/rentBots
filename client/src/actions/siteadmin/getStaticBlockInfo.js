import {
  STATIC_BLOCK_INFO_START,
  STATIC_BLOCK_INFO_SUCCESS,
  STATIC_BLOCK_INFO_ERROR
} from '../../constants';
import { getStaticInfo as query } from '../../lib/graphql';

export const getStaticBlockInfo = () => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: STATIC_BLOCK_INFO_START,
      });

      let settingsData = {};
      const { data } = await client.query({
        query,
        fetchPolicy: 'network-only'
      });

      if (data?.getStaticInfo) {
        data?.getStaticInfo?.map((item, key) => {
          settingsData[item.name] = item.value
        });

        dispatch({
          type: STATIC_BLOCK_INFO_SUCCESS,
          payload: {
            data: settingsData
          }
        });

      } else {
        dispatch({
          type: STATIC_BLOCK_INFO_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: STATIC_BLOCK_INFO_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
