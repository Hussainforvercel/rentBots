import {
    UPDATE_IMAGE_BANNER_START,
    UPDATE_IMAGE_BANNER_SUCCESS,
    UPDATE_IMAGE_BANNER_ERROR,
    IMAGE_BANNER_UPLOAD_LOADER_START,
    IMAGE_BANNER_UPLOAD_LOADER_STOP,
    UPLOAD_IMAGE_BANNER_START,
    UPLOAD_IMAGE_BANNER_SUCCESS,
    UPLOAD_IMAGE_BANNER_ERROR
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getImageBanner as query, updateImageBannerMutation, uploadImageBannerMutation } from '../../lib/graphql';
import { removeImage } from '../../helpers/removeImage';

const startBannerUploaderLoader = () => {
    return (dispatch, getState, { client }) => {
        dispatch({
            type: IMAGE_BANNER_UPLOAD_LOADER_START,
            payload: {
                bannerUploaderLoading: true
            }
        });
    };
}

const stopBannerUploaderLoader = () => {
    return (dispatch, getState, { client }) => {
        dispatch({
            type: IMAGE_BANNER_UPLOAD_LOADER_STOP,
            payload: {
                bannerUploaderLoading: false
            }
        });
    };
}

const doUpdateImageBanner = (values) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({ type: UPDATE_IMAGE_BANNER_START });

            const { data } = await client.mutate({
                mutation: updateImageBannerMutation,
                variables: values,
                refetchQueries: [{ query }]
            });

            if (data?.updateImageBanner?.status === "success") {
                showToaster({ messageId: 'updateBannerSettings', toasterType: 'success' })
                dispatch({ type: UPDATE_IMAGE_BANNER_SUCCESS });
            } else {
                dispatch({
                    type: UPDATE_IMAGE_BANNER_ERROR,
                    payload: {
                        status: data.updateImageBanner.status
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: UPDATE_IMAGE_BANNER_ERROR,
                payload: {
                    error
                }
            });
        }
    };
}

const doUploadImageBanner = (image, oldImage) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({ type: UPLOAD_IMAGE_BANNER_START });

            const { data } = await client.mutate({
                mutation: uploadImageBannerMutation,
                variables: {
                    image
                },
                refetchQueries: [{ query }]
            });

            if (data?.uploadImageBanner?.status === "success") {
                dispatch({
                    type: UPLOAD_IMAGE_BANNER_SUCCESS,
                    payload: {
                        bannerUploaderLoading: false
                    }
                });

                let url = '/deleteHomeBanner';
                if (oldImage != null) {
                    await removeImage({ url, fileName: oldImage });
                }
            } else {
                dispatch({
                    type: UPLOAD_IMAGE_BANNER_ERROR,
                    payload: {
                        status: data.uploadImageBanner.status,
                        bannerUploaderLoading: false
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: UPLOAD_IMAGE_BANNER_ERROR,
                payload: {
                    error,
                    bannerUploaderLoading: false
                }
            });
        }
    };
}

export { startBannerUploaderLoader, stopBannerUploaderLoader, doUpdateImageBanner, doUploadImageBanner };
