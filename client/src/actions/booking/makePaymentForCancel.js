import {
  BOOKING_PAYMENT_FOR_CANCEL_START,
  BOOKING_PAYMENT_FOR_CANCEL_SUCCESS,
  BOOKING_PAYMENT_FOR_CANCEL_ERROR,
} from '../../constants';
import { sendPayment } from '../../core/payment/sendPayment';
import { convert } from '../../helpers/currencyConvertion';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getPaymentState as query } from '../../lib/graphql';

export const makePaymentForCancel = (
  reservationId,
  amount,
  currency,
  paymentCurrency,
  title
) => {

  return async (dispatch, getState, { client }) => {
    try {

      dispatch({
        type: BOOKING_PAYMENT_FOR_CANCEL_START,
        payload: {
          paymentLoading: true
        }
      });

      let rates = getState().currency.rates, baseCurrency = getState().currency.base;
      let convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);

      const { data } = await client.query({
        query,
        variables: {
          reservationId
        },
      });

      if (data?.getPaymentState?.paymentState === 'completed') {
        showToaster({ messageId: 'checkPaymentState', toasterType: 'error' })
        dispatch({
          type: BOOKING_PAYMENT_FOR_CANCEL_ERROR,
          payload: { paymentLoading: false }
        });
        return false;
      }

      const { status, errorMessage } = await sendPayment(reservationId, convertedAmount.toFixed(2), paymentCurrency, title);

      if (status == 200) {
        dispatch({
          type: BOOKING_PAYMENT_FOR_CANCEL_SUCCESS
        });
      } else {
        if (status == 422) {
          showToaster({ messageId: 'invalidCurrency', toasterType: 'error' })
        }
        else {
          errorMessage ? showToaster({ messageId: 'checkStatus', toasterType: 'error', requestMessage: errorMessage }) : '';
        }
        dispatch({
          type: BOOKING_PAYMENT_FOR_CANCEL_ERROR,
          payload: { paymentLoading: false }
        });
      }
    } catch (error) {
      dispatch({
        type: BOOKING_PAYMENT_FOR_CANCEL_ERROR,
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