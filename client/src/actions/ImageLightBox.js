import {
    IMAGE_LIGHTBOX_OPEN,
    IMAGE_LIGHTBOX_CLOSE,
} from '../constants';

const openImageLightBox = (current) => {
    return async (dispatch) => {
        dispatch({
            type: IMAGE_LIGHTBOX_OPEN,
            imageLightBox: true,
            currentIndex: current
        });

        return true;
    };
}

const closeImageLightBox = () => {
    return async (dispatch) => {
        dispatch({
            type: IMAGE_LIGHTBOX_CLOSE,
            imageLightBox: false
        });

        return true;
    };
}

export { openImageLightBox, closeImageLightBox };