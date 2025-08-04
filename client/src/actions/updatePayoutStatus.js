import {
    SET_PAYOUT_STATUS_START,
    SET_PAYOUT_STATUS_SUCCESS,
    SET_PAYOUT_STATUS_ERROR
} from '../constants';
import showToaster from '../helpers/toasterMessages/showToaster';
import { updatePayoutStatus as mutation } from '../lib/graphql';

export const updatePayoutStatus = (id, isHold) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: SET_PAYOUT_STATUS_START
            });

            const { data } = await client.mutate({
                mutation,
                variables: {
                    id,
                    isHold
                }
            });

            if (data?.updatePayoutStatus && data?.updatePayoutStatus.status == '200') {
                dispatch({
                    type: SET_PAYOUT_STATUS_SUCCESS
                });
                showToaster({ messageId: 'payoutStatusSuccess', toasterType: 'success' })
                return true;
            } else {
                dispatch({
                    type: SET_PAYOUT_STATUS_ERROR
                });
                showToaster({ messageId: 'payoutStatusFailed', toasterType: 'error' })
            }
        } catch (error) {
            dispatch({
                type: SET_PAYOUT_STATUS_ERROR
            });
            showToaster({ messageId: 'payoutStatusFailed', toasterType: 'error' })
        }
    }
}