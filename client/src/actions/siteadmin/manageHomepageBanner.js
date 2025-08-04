import {
    HOME_BANNER_UPLOAD_LOADER_START,
    HOME_BANNER_UPLOAD_LOADER_STOP,
    UPLOAD_HOME_BANNER_START,
    UPLOAD_HOME_BANNER_SUCCESS,
    UPLOAD_HOME_BANNER_ERROR,
} from '../../constants';
import { getBanner as query, uploadHomeBanner as mutation } from '../../lib/graphql';
import { removeImage } from '../../helpers/removeImage';

const startBannerUploaderLoader = () => {
    return (dispatch, getState, { client }) => {
        dispatch({
            type: HOME_BANNER_UPLOAD_LOADER_START,
            payload: {
                bannerUploaderLoading: true
            }
        });
    };
}

const stopBannerUploaderLoader = () => {
    return (dispatch, getState, { client }) => {
        dispatch({
            type: HOME_BANNER_UPLOAD_LOADER_STOP,
            payload: {
                bannerUploaderLoading: false
            }
        });
    };
}

const doUploadHomeBanner = (image, oldImage, id) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({ type: UPLOAD_HOME_BANNER_START });

            const { data } = await client.mutate({
                mutation,
                variables: {
                    id,
                    image
                },
                refetchQueries: [{ query }]
            });

            if (data?.uploadHomeBanner?.status === "success") {
                dispatch({
                    type: UPLOAD_HOME_BANNER_SUCCESS,
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
                    type: UPLOAD_HOME_BANNER_ERROR,
                    payload: {
                        status: data.uploadImageBanner.status,
                        bannerUploaderLoading: false
                    }
                });
            }
        } catch (error) {
            dispatch({
                type: UPLOAD_HOME_BANNER_ERROR,
                payload: {
                    error,
                    bannerUploaderLoading: false
                }
            });
        }
    };
}

export { startBannerUploaderLoader, stopBannerUploaderLoader, doUploadHomeBanner };
