import {
  REMOVE_LIST_PHOTOS_START,
  REMOVE_LIST_PHOTOS_SUCCESS,
  REMOVE_LIST_PHOTOS_ERROR
} from '../constants';
import { change } from 'redux-form';
// To show updated files
import { getListPhotos } from './getListPhotos';
import { getListingDataStep2 } from './getListingDataStep2';
import { removeListPhotos as query } from '../lib/graphql';

export const removeListPhotos = (listId, name, reload) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: REMOVE_LIST_PHOTOS_START,
      });

      // Remove file physically
      const resp = await fetch('/deletePhotos', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: name }),
        credentials: 'include',
      });

      const { status } = await resp.json();

      if (status) {
        // Send Request to remove a photo of a listing
        const { data } = await client.query({
          query,
          variables: { listId, name },
          fetchPolicy: 'network-only'
        });

        if (data?.RemoveListPhotos) {
          await dispatch(getListingDataStep2(listId));
          if (data?.RemoveListPhotos?.iscoverPhotoDeleted) {
            await dispatch(change('ListPlaceStep2', 'coverPhoto', null));
          }
          dispatch({
            type: REMOVE_LIST_PHOTOS_SUCCESS,
            photosCount: data.RemoveListPhotos.photosCount
          });
          // Reload show image block
          if (reload) {
            dispatch(getListPhotos(listId));
          }
        }

      }
    } catch (error) {
      dispatch({
        type: REMOVE_LIST_PHOTOS_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
