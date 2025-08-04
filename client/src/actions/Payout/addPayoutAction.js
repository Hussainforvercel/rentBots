import {
  ADD_PAYOUT_START,
  ADD_PAYOUT_SUCCESS,
  ADD_PAYOUT_ERROR,
} from '../../constants';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import { getPayouts } from '../../actions/Payout/getPayouts';
import showToaster from '../../helpers/toasterMessages/showToaster';
import history from '../../core/history';
import { addPayout as mutation } from '../../lib/graphql';

const addPayout = (
  methodId,
  payEmail,
  address1,
  address2,
  city,
  state,
  country,
  zipcode,
  currency,
  firstname,
  lastname,
  accountNumber,
  routingNumber,
  ssn4Digits,
  businessType,
  userId,
  accountToken,
  personToken
) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: ADD_PAYOUT_START,
        payload: {
          payoutLoading: true
        }
      });

      if (methodId == 1) { // PayPal
        const { data } = await client.mutate({
          mutation,
          variables: {
            methodId,
            payEmail,
            address1,
            address2,
            city,
            state,
            country,
            zipcode,
            currency,
            isVerified: true
          }
        });

        await dispatch(getPayouts());

        if (data?.addPayout) {
          dispatch({
            type: ADD_PAYOUT_SUCCESS,
            payload: {
              status: data.addPayout.status,
              payoutLoading: false
            }
          });
          history.push('/user/payout');
        }
      } else { // Stripe

        let userDetails = {
          userId,
          payEmail
        };

        let bankDetails = {
          firstname,
          lastname,
          routingNumber,
          accountNumber,
          city,
          address1,
          zipcode,
          state,
          country,
          currency,
          businessType,
          ssn4Digits,
          accountToken,
          personToken
        };

        const { status, errorMessage, accountId, isVerified } = await processStripePayment(
          'addPayout',
          userDetails,
          bankDetails
        );

        if (status === 200 && accountId) {
          dispatch({
            type: ADD_PAYOUT_SUCCESS,
            payload: {
              status,
              payoutLoading: false
            }
          });
        } else {
          showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage })
          dispatch({
            type: ADD_PAYOUT_ERROR,
            payload: {
              errorMessage,
              payoutLoading: false
            }
          });
        }
      }
    } catch (error) {
      dispatch({
        type: ADD_PAYOUT_ERROR,
        payload: {
          error,
          payoutLoading: false
        }
      });
      return false;
    }

    return true;
  };
}

const startPayoutLoading = () => {
  return async (dispatch, getState, { client }) => {
    await dispatch({
      type: ADD_PAYOUT_START,
      payload: {
        payoutLoading: true
      }
    });
  }
};

const stopPayoutLoading = () => {
  return async (dispatch, getState, { client }) => {
    await dispatch({
      type: ADD_PAYOUT_SUCCESS,
      payload: {
        payoutLoading: false
      }
    });
  }
};

export { addPayout, startPayoutLoading, stopPayoutLoading }; 