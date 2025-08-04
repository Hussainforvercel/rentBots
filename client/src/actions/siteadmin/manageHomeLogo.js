import {
  LOGO_UPLOAD_START,
  HOME_LOGO_UPLOAD_LOADER_START,
  HOME_LOGO_UPLOAD_LOADER_STOP,
  HOME_LOGO_UPLOAD_SUCCESS,
  HOME_LOGO_UPLOAD_ERROR,
  REMOVE_HOME_LOGO_SUCCESS,
  REMOVE_HOME_LOGO_START,
  REMOVE_HOME_LOGO_ERROR,
} from '../../constants';
import { setSiteSettings } from '../siteSettings';
import { getHomeLogo as query, uploadHomeLogoMutation, removeHomeLogoMutation } from '../../lib/graphql';
import { removeImage } from '../../helpers/removeImage';

const startLogoUploaderLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: HOME_LOGO_UPLOAD_LOADER_START,
      payload: {
        homeLogoUploaderLoading: true
      }
    });
  };
}

const stopLogoUploaderLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: HOME_LOGO_UPLOAD_LOADER_STOP,
      payload: {
        homeLogoUploaderLoading: false
      }
    });
  };
}

const doUploadLogo = (fileName, filePath, oldPicture) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: LOGO_UPLOAD_START });

      const { data } = await client.mutate({
        mutation: uploadHomeLogoMutation,
        variables: { fileName },
        refetchQueries: [{ query }]
      });

      if (data) {
        dispatch({
          type: HOME_LOGO_UPLOAD_SUCCESS,
          payload: {
            homeLogoUploaderLoading: false
          }
        });
        dispatch(setSiteSettings());

        let url = '/removeHomeLogoFile';

        if (oldPicture != null) {
          await removeImage({ url, fileName: oldPicture });
        }
      }
    } catch (error) {
      dispatch({
        type: HOME_LOGO_UPLOAD_ERROR,
        payload: {
          error,
          homeLogoUploaderLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const doRemoveLogo = (fileName) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: REMOVE_HOME_LOGO_START });
      dispatch(startLogoUploaderLoader());

      const { data } = await client.mutate({
        mutation: removeHomeLogoMutation,
        refetchQueries: [{ query }]
      });

      if (data) {
        dispatch(setSiteSettings());

        let url = '/removeHomeLogoFile';
        await removeImage({ url, fileName });

        dispatch({
          type: REMOVE_HOME_LOGO_SUCCESS,
          payload: {
            homeLogoUploaderLoading: false
          }
        });
      }
    } catch (error) {
      dispatch({
        type: REMOVE_HOME_LOGO_ERROR,
        payload: {
          error,
          homeLogoUploaderLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

export { startLogoUploaderLoader, stopLogoUploaderLoader, doUploadLogo, doRemoveLogo };