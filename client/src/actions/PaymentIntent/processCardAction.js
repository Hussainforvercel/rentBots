import {
    BOOKING_PAYMENT_START,
    BOOKING_PAYMENT_SUCCESS,
    BOOKING_PAYMENT_ERROR,
} from '../../constants';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import showToaster from '../../helpers/toasterMessages/showToaster';

export const processCardAction = (
    reservationId,
    listId,
    hostId,
    guestId,
    title,
    guestEmail,
    amount,
    currency,
    confirmPaymentIntentId
) => {
    return async (dispatch, getState, { client }) => {

        try {

            dispatch({
                type: BOOKING_PAYMENT_START,
                payload: {
                    paymentLoading: true,
                    reservationId
                }
            });

            let reservationDetails = {
                reservationId,
                listId,
                hostId,
                guestId,
                guestEmail,
                title,
                amount,
                currency
            }, cardDetails = {};

            const { status, errorMessage } = await processStripePayment(
                'confirmReservation',
                cardDetails,
                reservationDetails,
                null,
                confirmPaymentIntentId
            );

            if (status && status == 200) {
                dispatch({
                    type: BOOKING_PAYMENT_SUCCESS,
                    payload: {
                        paymentLoading: false
                    }
                });
                return {
                    status,
                    errorMessage
                };
            } else {
                errorMessage ? showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage }) : '';
                dispatch({
                    type: BOOKING_PAYMENT_ERROR,
                    payload: {
                        paymentLoading: false
                    }
                });
            }

        } catch (error) {
            dispatch({
                type: BOOKING_PAYMENT_ERROR,
                payload: {
                    error,
                    paymentLoading: false
                }
            });
            return false;
        }
        return true;
    };
}