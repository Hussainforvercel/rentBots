import { change } from 'redux-form';
import {
  LOCATION_UPLOAD_LOADER_START,
  LOCATION_UPLOAD_START,
  LOCATION_UPLOAD_SUCCESS,
  LOCATION_UPLOAD_ERROR,
  REMOVE_LOCATION_START,
  REMOVE_LOCATION_SUCCESS,
  REMOVE_LOCATION_ERROR,
} from '../../constants';
import { editPopularLocation as query, uploadLocationMutation, removeLocationMutation } from '../../lib/graphql';
import { removeImage } from '../../helpers/removeImage';

const startLocationUploaderLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: LOCATION_UPLOAD_LOADER_START,
      payload: {
        locationUploaderLoading: true
      }
    });
  };
}

const endLocationUploaderLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: LOCATION_UPLOAD_LOADER_START,
      payload: {
        locationUploaderLoading: false
      }
    });
  };
}

const doUploadLocation = (image, filePath, oldPicture, id) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: LOCATION_UPLOAD_START });

      const { data } = await client.mutate({
        mutation: uploadLocationMutation,
        variables: { image, id },
        refetchQueries: [{ query, variables: { id } }]
      });

      if (data) {
        dispatch({
          type: LOCATION_UPLOAD_SUCCESS,
          payload: {
            locationUploaderLoading: false
          }
        });

        let url = '/removeLocationFile';
        if (oldPicture != null) {
          await removeImage({ url, fileName: oldPicture });
        }
      }
    } catch (error) {
      dispatch({
        type: LOCATION_UPLOAD_ERROR,
        payload: {
          error,
          locationUploaderLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const doRemoveLocation = (image, id) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: REMOVE_LOCATION_START });
      dispatch(startLocationUploaderLoader());
      dispatch(change('EditPopularLocation', 'image', null));

      const { data } = await client.mutate({
        mutation: removeLocationMutation,
        variables: { image, id },
        refetchQueries: [{ query, variables: { id } }]
      });

      if (data) {
        dispatch({
          type: REMOVE_LOCATION_SUCCESS,
          payload: {
            locationUploaderLoading: false
          }
        });
        let url = '/removeLocationFile';
        await removeImage({ url, fileName: image });
      }

    } catch (error) {
      dispatch({
        type: REMOVE_LOCATION_ERROR,
        payload: {
          error,
          locationUploaderLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

export { startLocationUploaderLoader, endLocationUploaderLoader, doUploadLocation, doRemoveLocation };