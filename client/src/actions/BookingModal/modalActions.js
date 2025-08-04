import {
    OPEN_BOOKING_MODAL,
    CLOSE_BOOKING_MODAL,
} from '../../constants';

const openBookingModal = () => {
    return async (dispatch) => {
        dispatch({
            type: OPEN_BOOKING_MODAL,
            payload: {
                bookingModal: true
            }
        });

        return true;
    };
}

const closeBookingModal = () => {
    return async (dispatch) => {
        dispatch({
            type: CLOSE_BOOKING_MODAL,
            payload: {
                bookingModal: false
            }
        });

        return true;
    };
}

export { openBookingModal, closeBookingModal };