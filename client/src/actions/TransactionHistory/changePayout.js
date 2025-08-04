import {
  CHANGE_PAYOUT_START,
  CHANGE_PAYOUT_SUCCESS,
  CHANGE_PAYOUT_ERROR,
} from '../../constants';
import { updatePayoutForReservation as mutation } from '../../lib/graphql';

export const changePayout = (payoutId, reservationId) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: CHANGE_PAYOUT_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          payoutId,
          reservationId
        }
      });

      if (data?.updatePayoutForReservation) {
        dispatch({
          type: CHANGE_PAYOUT_SUCCESS,
          payload: {
            status: data.updatePayoutForReservation.status
          }
        });
      }

    } catch (error) {
      dispatch({
        type: CHANGE_PAYOUT_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}