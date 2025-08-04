import {
  SET_DEFAULT_PAYOUT_START,
  SET_DEFAULT_PAYOUT_SUCCESS,
  SET_DEFAULT_PAYOUT_ERROR,
} from '../../constants';
import { setLoaderStart, setLoaderComplete } from '../loader/loader';
import { getPayouts } from './getPayouts';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { setDefaultPayout as mutation } from '../../lib/graphql';

export const setDefaultPayout = (id) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: SET_DEFAULT_PAYOUT_START,
      });
      dispatch(setLoaderStart('payoutDefault'));

      const { data } = await client.mutate({
        mutation,
        variables: {
          id
        }
      });

      if (data?.setDefaultPayout) {
        await dispatch({
          type: SET_DEFAULT_PAYOUT_SUCCESS,
          payload: {
            status: data.setDefaultPayout.status
          }
        });
        showToaster({ messageId: 'statusUpdate', toasterType: 'success' })
        await dispatch(getPayouts());
      }

      await dispatch(setLoaderComplete('payoutDefault'));

    } catch (error) {
      dispatch({
        type: SET_DEFAULT_PAYOUT_ERROR,
        payload: {
          error
        }
      });
      dispatch(setLoaderComplete('payoutDefault'));
      return false;
    }

    return true;
  };
}
