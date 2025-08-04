import {
    ON_CHANGE_PAYOUT_START
} from '../../constants';

export const payoutChangeListing = (payoutValue) => {
    return (dispatch, getState) => {
        dispatch({
            type: ON_CHANGE_PAYOUT_START,
            onChangePayoutId: payoutValue
        });
    };
}