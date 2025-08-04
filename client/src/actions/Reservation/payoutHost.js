import {
  ADMIN_PAYOUT_HOST_START,
  ADMIN_PAYOUT_HOST_SUCCESS,
  ADMIN_PAYOUT_HOST_ERROR,
} from '../../constants';
import { sendPaymentToHost } from '../../core/payment/payout/sendPaymentToHost';
import { convert } from '../../helpers/currencyConvertion';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import showToaster from '../../helpers/toasterMessages/showToaster';

export const payoutHost = (
  reservationId,
  destination,
  payoutId,
  amount,
  currency,
  paymentCurrency,
  userId,
  paymentMethodId,
  hostEmail,
  changeState
) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: ADMIN_PAYOUT_HOST_START,
        payload: {
          loading: true,
          reservationId
        }
      });

      let rates, baseCurrency, convertedAmount;
      rates = getState().currency.rates;
      baseCurrency = getState().currency.base;
      convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);

      if (paymentMethodId == 1) { // Pay Pal
        const { status, errorMessage } = await sendPaymentToHost(
          reservationId,
          destination,
          payoutId,
          convertedAmount.toFixed(2),
          paymentCurrency,
          userId,
          paymentMethodId
        );

        if (status && (status === 'SUCCESS' || status === 'PENDING')) {
          dispatch({
            type: ADMIN_PAYOUT_HOST_SUCCESS,
            payload: {
              loading: false,
              completed: true
            }
          });

          if (changeState) {
            changeState('successPayout', reservationId);
          }
          showToaster({ messageId: 'successPayout', toasterType: 'success' })
        } else {
          if (errorMessage) {
            showToaster({ messageId: 'checkStatus', toasterType: 'error', requestMessage: errorMessage })
          } else {
            showToaster({ messageId: 'paymentToOwnerFailed', toasterType: 'error' })
          }

          dispatch({
            type: ADMIN_PAYOUT_HOST_ERROR,
            payload: {
              loading: false
            }
          });
        }
      } else { // Stripe
        let cardDetails = {};
        let reservationDetails = {
          reservationId,
          amount: convertedAmount.toFixed(2),
          currency: paymentCurrency,
          hostEmail,
          payoutId,
          userId,
          destination,
          transfer_group: 'Payout to Host'
        };

        const { status, errorMessage } = await processStripePayment(
          'payout',
          cardDetails,
          reservationDetails
        );

        if (status && status === 200) {
          dispatch({
            type: ADMIN_PAYOUT_HOST_SUCCESS,
            payload: {
              loading: false,
              completed: true
            }
          });

          if (changeState) {
            changeState('successPayout', reservationId);
          }
          showToaster({ messageId: 'successPayout', toasterType: 'success' })
        } else if (status === 400 && errorMessage) {
          showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage });
        }
        else {
          showToaster({ messageId: 'failedPayout', toasterType: 'error' })
          dispatch({
            type: ADMIN_PAYOUT_HOST_ERROR,
            payload: {
              loading: false
            }
          });
        }
      }

      if (changeState) {
        changeState('removePayout', reservationId);
      }
    } catch (error) {
      dispatch({
        type: ADMIN_PAYOUT_HOST_ERROR,
        payload: {
          error,
          loading: false
        }
      });

      if (changeState) {
        changeState('removePayout', reservationId);
      }
      return false;
    }
    return true;
  };
}