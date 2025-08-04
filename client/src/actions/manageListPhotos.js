import { change } from 'redux-form';
import fetch from '../core/fetch';
import {
  CREATE_LIST_PHOTOS_START,
  CREATE_LIST_PHOTOS_SUCCESS,
  CREATE_LIST_PHOTOS_ERROR,
  REMOVE_LIST_PHOTOS_START,
  REMOVE_LIST_PHOTOS_SUCCESS,
  REMOVE_LIST_PHOTOS_ERROR
} from '../constants';
import { getListPhotos } from './getListPhotos';
import { getListingDataStep2 } from './getListingDataStep2';
import showToaster from '../helpers/toasterMessages/showToaster';
import {
  uploadListPhotosMutation, removeListPhotosMutation,
  reservationCount, showListPhotosQuery
} from '../lib/graphql';

export const createListPhotos = (listId, name, type) => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({
        type: CREATE_LIST_PHOTOS_START,
      });

      // Send Request to create a record for a listing
      const { data } = await client.mutate({
        mutation: uploadListPhotosMutation,
        variables: { listId, name, type },
      });

      if (data?.CreateListPhotos?.status === 'success') {
        dispatch(getListPhotos(listId));
        dispatch({
          type: CREATE_LIST_PHOTOS_SUCCESS,
          photosCount: data?.CreateListPhotos?.photosCount
        });
        showToaster({ messageId: 'uploadCarPhoto', toasterType: 'success' })
      }

    } catch (error) {
      dispatch({
        type: CREATE_LIST_PHOTOS_ERROR,
      });
      return false;
    }
    return true;
  };
}

export const removeListPhotos = (listId, name, reload) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: REMOVE_LIST_PHOTOS_START,
      });

      const reservationCountData = await client.query({
        query: reservationCount,
        variables: { listId },
      });

      if (reservationCountData?.data?.getUpcomingBookings && reservationCountData?.data?.getUpcomingBookings?.count > 0) {
        // If reservation found
        const showListPhotosData = await client.query({
          query: showListPhotosQuery,
          variables: { listId },
        });

        if (showListPhotosData?.data?.ShowListPhotos?.length <= 1) {
          // If length less 
          showToaster({ messageId: 'removePhotosListing', toasterType: 'error' })
          dispatch({
            type: REMOVE_LIST_PHOTOS_ERROR,
          });

        }
        else {
          // If length more 
          const { data } = await client.mutate({
            mutation: removeListPhotosMutation,
            variables: { listId, name },
          });

          if (data?.RemoveListPhotos?.status === 'success') {
            await dispatch(getListingDataStep2(listId));
            if (data?.RemoveListPhotos?.iscoverPhotoDeleted) {
              await dispatch(change('ListPlaceStep2', 'coverPhoto', null));
            }
            dispatch({
              type: REMOVE_LIST_PHOTOS_SUCCESS,
              photosCount: data?.RemoveListPhotos?.photosCount
            });
            dispatch(getListPhotos(listId));

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
          }
        }
      } else {
        // no reservation found
        const { data } = await client.mutate({
          mutation: removeListPhotosMutation,
          variables: { listId, name },
        });

        if (data?.RemoveListPhotos?.status === 'success') {
          await dispatch(getListingDataStep2(listId));
          if (data?.RemoveListPhotos?.iscoverPhotoDeleted) {
            await dispatch(change('ListPlaceStep2', 'coverPhoto', null));
          }
          dispatch({
            type: REMOVE_LIST_PHOTOS_SUCCESS,
            photosCount: data?.RemoveListPhotos?.photosCount
          });
          dispatch(getListPhotos(listId));

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
