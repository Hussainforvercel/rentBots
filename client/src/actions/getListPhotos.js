import {
  SHOW_LIST_PHOTOS_START,
  SHOW_LIST_PHOTOS_SUCCESS,
  SHOW_LIST_PHOTOS_ERROR
} from '../constants';
import { listPhotos as query } from '../lib/graphql';

export const getListPhotos = (listId) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: SHOW_LIST_PHOTOS_START,
      });

      let id = Number(listId);
      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId: id },
        fetchPolicy: 'network-only'
      });

      if (data?.ShowListPhotos) {
        dispatch({
          type: SHOW_LIST_PHOTOS_SUCCESS,
          listPhotos: data.ShowListPhotos,
          photosCount: data.ShowListPhotos.length
        });
      } else {
        dispatch({
          type: SHOW_LIST_PHOTOS_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: SHOW_LIST_PHOTOS_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
