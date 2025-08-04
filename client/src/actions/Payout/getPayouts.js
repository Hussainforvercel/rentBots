import {
  GET_PAYOUT_START,
  GET_PAYOUT_SUCCESS,
  GET_PAYOUT_ERROR,
} from '../../constants';
import { getPayoutsQuery } from '../../lib/graphql';

export const getPayouts = (currentAccountId, userId) => {
  return async (dispatch, getState, { client }) => {

    try {

      await dispatch({
        type: GET_PAYOUT_START,
        payload: {
          getPayoutLoading: true
        }
      });

      const { data } = await client.query({
        query: getPayoutsQuery,
        variables: {
          currentAccountId,
          userId
        },
        fetchPolicy: 'network-only'
      });

      if (data?.getPayouts?.length >= 0) {
        await dispatch({
          type: GET_PAYOUT_SUCCESS,
          payload: {
            payoutData: data.getPayouts,
            getPayoutLoading: false
          }
        });
      } else {
        await dispatch({
          type: GET_PAYOUT_ERROR,
          payload: {
            error: 'No records found.',
            getPayoutLoading: false
          }
        });
      }
    } catch (error) {
      await dispatch({
        type: GET_PAYOUT_ERROR,
        payload: {
          error,
          getPayoutLoading: false
        }
      });
      return false;
    }

    return true;
  };
}
