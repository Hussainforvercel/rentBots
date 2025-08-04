import {
  ADMIN_REFUND_GUEST_START,
  ADMIN_REFUND_GUEST_SUCCESS,
  ADMIN_REFUND_GUEST_ERROR,
} from '../../constants';

import { refundToGuest } from '../../core/payment/refund/refundToGuest';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { convert } from '../../helpers/currencyConvertion';

export const refundGuest = (
  reservationId,
  receiverEmail,
  receiverId,
  payerEmail,
  payerId,
  amount,
  currency,
  paymentCurrency,
  paymentMethodId,
  transactionId,
  changeState
) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: ADMIN_REFUND_GUEST_START,
        payload: {
          refundLoading: true,
          reservationId
        }
      });

      let rates = getState().currency.rates, baseCurrency = getState().currency.base, convertedAmount = 0;
      let currentCurrency = (getState().currency.to) ? getState().currency.to : getState().currency.base;
      if (paymentMethodId == 1) {
        // PayPal
        convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);
        const { status, errorMessage } = await refundToGuest(
          reservationId, receiverEmail, receiverId, payerEmail, payerId, convertedAmount.toFixed(2), paymentCurrency, transactionId
        );

        if (status && status === 'SUCCESS') {
          dispatch({
            type: ADMIN_REFUND_GUEST_SUCCESS,
            payload: {
              refundLoading: false,
              completed: true
            }
          });

          if (changeState) {
            changeState('successRefund', reservationId);
          }
          showToaster({ messageId: 'paymentTransferToReenter', toasterType: 'success' })
        } else {
          if (errorMessage) {
            showToaster({ messageId: 'checkStatus', toasterType: 'error', requestMessage: errorMessage })
          } else {
            showToaster({ messageId: 'paymentTransferFailed', toasterType: 'error' })
          }

          dispatch({
            type: ADMIN_REFUND_GUEST_ERROR,
            payload: {
              refundLoading: false
            }
          });
        }
      } else {
        // Stripe 
        let cardDetails = {};
        let reservationDetails = {
          reservationId,
          amount: amount.toFixed(2),
          currency,
          transactionId,
          payerEmail,
          customerId: receiverId
        };

        const { status, errorMessage } = await processStripePayment(
          'refund',
          cardDetails,
          reservationDetails
        );

        if (status === 200) {
          dispatch({
            type: ADMIN_REFUND_GUEST_SUCCESS,
            payload: {
              refundLoading: false,
              completed: true
            }
          });

          if (changeState) {
            changeState('successRefund', reservationId);
          }
          showToaster({ messageId: 'paymentTransferToReenter', toasterType: 'success' })
        } else {
          showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage })
          dispatch({
            type: ADMIN_REFUND_GUEST_ERROR,
            payload: {
              refundLoading: false
            }
          });
        }
      }

      if (changeState) {
        changeState('removeRefund', reservationId);
      }
    } catch (error) {
      dispatch({
        type: ADMIN_REFUND_GUEST_ERROR,
        payload: {
          error,
          refundLoading: false
        }
      });

      if (changeState) {
        changeState('removeRefund', reservationId);
      }
      return false;
    }

    return true;
  };
}