import { change } from 'redux-form';
import {
  STATIC_BLOCK_IMAGE_UPLOAD_START,
  STATIC_BLOCK_IMAGE_START,
  STATIC_BLOCK_IMAGE_SUCCESS,
  STATIC_BLOCK_IMAGE_ERROR,
  REMOVE_STATIC_INFO_IMAGE_START,
  REMOVE_STATIC_INFO_IMAGE_SUCCESS,
  REMOVE_STATIC_INFO_IMAGE_ERROR,
  STATIC_INFO_BLOCK_UPLOAD_LOADER_START,
  UPLOAD_STATIC_INFO_BLOCK_IMAGE_START,
  UPLOAD_STATIC_INFO_BLOCK_IMAGE_SUCCESS,
  UPLOAD_STATIC_INFO_BLOCK_IMAGE_ERROR,
  DELETE_STATIC_INFO_IMAGE_START,
  DELETE_STATIC_INFO_IMAGE_SUCCESS,
  DELETE_STATIC_INFO_IMAGE_ERROR,
  CARBLOCK_IMAGE_UPLOAD_START,
  COUNTERBLOCK_IMAGE_UPLOAD_START,
  CARBLOCK_IMAGE_UPLOAD_SUCCESS,
  COUNTERBLOCK_IMAGE_UPLOAD_SUCCESS
} from '../../constants';
import { getStaticBlockInfo } from './getStaticBlockInfo';
import {
  getStaticInfoQuery as query, uploadStaticBlockImageMutation,
  removeStaticBlockImagesMutation
} from '../../lib/graphql';
import { removeImage } from '../../helpers/removeImage';

const startStaticImageLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: STATIC_BLOCK_IMAGE_UPLOAD_START,
      payload: {
        staticImageLoading: true
      }
    });
  };
}

const startStaticImage2Loader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: CARBLOCK_IMAGE_UPLOAD_START,
      payload: {
        loader: true
      }
    });
  };
}

const stopStaticImageLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: STATIC_BLOCK_IMAGE_UPLOAD_START,
      payload: {
        staticImageLoading: false
      }
    });
  };
}

const doUploadStaticImage = (fileName, filePath, oldPicture, name) => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({ type: STATIC_BLOCK_IMAGE_START });

      const { data } = await client.mutate({
        mutation: uploadStaticBlockImageMutation,
        variables: { fileName, filePath, name },
        refetchQueries: [{ query, variables: { name } }]
      });

      if (data) {
        await dispatch(getStaticBlockInfo());
        dispatch({
          type: STATIC_BLOCK_IMAGE_SUCCESS,
          payload: {
            staticImageLoading: false
          }
        });

        dispatch({
          type: CARBLOCK_IMAGE_UPLOAD_SUCCESS,
          payload: {
            loader: false
          }
        });

        let url = '/deleteHomeBanner';
        if (oldPicture != null) {
          await removeImage({ url, fileName: oldPicture });
        }
      }
    } catch (error) {
      dispatch({
        type: STATIC_BLOCK_IMAGE_ERROR,
        payload: {
          error,
          staticImageLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const doRemoveStaticImage = (fileName, name) => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({ type: REMOVE_STATIC_INFO_IMAGE_START });
      dispatch(startStaticImageLoader());
      dispatch(change('StaticBlockForm', 'blockImage1', null));

      const { data } = await client.mutate({
        mutation: removeStaticBlockImagesMutation,
        variables: { name },
        refetchQueries: [{ query, variables: { name } }]
      });

      if (data) {
        dispatch({
          type: REMOVE_STATIC_INFO_IMAGE_SUCCESS,
          payload: {
            staticImageLoading: false
          }
        });

        let url = '/deleteHomeBanner';
        await dispatch(getStaticBlockInfo());
        await removeImage({ url, fileName });
      }

    } catch (error) {
      dispatch({
        type: REMOVE_STATIC_INFO_IMAGE_ERROR,
        payload: {
          error,
          staticImageLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const uploadStaticImageLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: STATIC_INFO_BLOCK_UPLOAD_LOADER_START,
      payload: {
        staticBlockImageLoading: true
      }
    });
  };
}

const uploadStaticImage2Loader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: COUNTERBLOCK_IMAGE_UPLOAD_START,
      payload: {
        loader2: true
      }
    });
  };
}

const stopuploadStaticImageLoader = () => {
  return (dispatch, getState, { client }) => {
    dispatch({
      type: STATIC_INFO_BLOCK_UPLOAD_LOADER_START,
      payload: {
        staticBlockImageLoading: false
      }
    });
  };
}

const doUploadStaticImageBlock = (fileName, filePath, oldPicture, name) => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({ type: UPLOAD_STATIC_INFO_BLOCK_IMAGE_START });

      const { data } = await client.mutate({
        mutation: uploadStaticBlockImageMutation,
        variables: { fileName, filePath, name },
        refetchQueries: [{ query, variables: { name } }]
      });

      if (data) {
        dispatch({
          type: UPLOAD_STATIC_INFO_BLOCK_IMAGE_SUCCESS,
          payload: {
            staticBlockImageLoading: false
          }
        });

        dispatch({
          type: COUNTERBLOCK_IMAGE_UPLOAD_SUCCESS,
          payload: {
            loader2: false
          }
        });

        let url = '/deleteHomeBanner';
        if (oldPicture != null) {
          await removeImage({ url, fileName: oldPicture });
        }
      }
    } catch (error) {
      dispatch({
        type: UPLOAD_STATIC_INFO_BLOCK_IMAGE_ERROR,
        payload: {
          error,
          staticBlockImageLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const doRemoveStaticImageBlock = (fileName, name) => {
  return async (dispatch, getState, { client }) => {
    try {
      dispatch({ type: DELETE_STATIC_INFO_IMAGE_START });
      dispatch(uploadStaticImageLoader());
      dispatch(change('StaticBlockForm', 'blockImage2', null));

      const { data } = await client.mutate({
        mutation: removeStaticBlockImagesMutation,
        variables: { name },
        refetchQueries: [{ query, variables: { name } }]
      });

      if (data) {
        dispatch({
          type: DELETE_STATIC_INFO_IMAGE_SUCCESS,
          payload: {
            staticBlockImageLoading: false
          }
        });

        let url = '/deleteHomeBanner';
        await dispatch(getStaticBlockInfo());
        await removeImage({ url, fileName });
      }
    } catch (error) {
      dispatch({
        type: DELETE_STATIC_INFO_IMAGE_ERROR,
        payload: {
          error,
          staticBlockImageLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

export {
  startStaticImageLoader, startStaticImage2Loader, stopStaticImageLoader,
  doUploadStaticImage, doRemoveStaticImage, uploadStaticImageLoader, uploadStaticImage2Loader,
  stopuploadStaticImageLoader, doUploadStaticImageBlock, doRemoveStaticImageBlock
};