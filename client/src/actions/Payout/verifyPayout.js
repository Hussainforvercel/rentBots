import {
  VERIFY_PAYOUT_START,
  VERIFY_PAYOUT_SUCCESS,
  VERIFY_PAYOUT_ERROR,
} from '../../constants';

import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import { setLoaderStart, setLoaderComplete } from '../loader/loader';

export const verifyPayout = (currentAccountId, userId) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: VERIFY_PAYOUT_START,
      });
      await dispatch(setLoaderStart('payoutVerify'));

      let userDetails = {
        currentAccountId,
        userId
      };

      const { status } = await processStripePayment(
        'verifyPayout',
        userDetails
      );

      if (status && status === 200) {
        await dispatch({
          type: VERIFY_PAYOUT_SUCCESS,
          payload: {
            status
          }
        });
      }
      await dispatch(setLoaderComplete('payoutVerify'));
    } catch (error) {
      dispatch({
        type: VERIFY_PAYOUT_ERROR,
        payload: {
          error
        }
      });

      await dispatch(setLoaderComplete('payoutVerify'));
      return false;
    }

    return true;
  };
}
