import {
    GET_BLOCKED_START,
    GET_BLOCKED_SUCCESS,
    GET_BLOCKED_ERROR
} from '../../constants';
// import { UserListing as query, ListingDataUpdate as mutation } from '../../lib/graphql';

export const getListBlockedDates = (
    listId,
    minDayValues,
    maxDayValues,
    checkInEndValue,
    checkInStartValue,
    houseRules,
    isCancel,
    isMaxDays,
    isBooking,
    basePrice,
    delivery,
    currency,
    monthlyDiscount,
    weeklyDiscount,
    securityDeposit
) => {
    return async (dispatch, getState, { client }) => {
        try {

            dispatch({
                type: GET_BLOCKED_START,
            });

            const { data } = await client.mutate({
                mutation,
                variables: {
                    id: listId,
                    minDay: minDayValues,
                    maxDay: maxDayValues,
                    checkInStart: checkInStartValue,
                    checkInEnd: checkInEndValue,
                    houseRules: houseRules,
                    cancellationPolicy: isCancel,
                    maxDaysNotice: isMaxDays,
                    bookingNoticeTime: isBooking,
                    basePrice: basePrice,
                    delivery: delivery,
                    currency: currency,
                    monthlyDiscount: monthlyDiscount ? monthlyDiscount : 0,
                    weeklyDiscount: weeklyDiscount ? weeklyDiscount : 0,
                    securityDeposit
                },
                refetchQueries: [{ query, variables: { listId: listId, preview: true } }]
            });

            if (data?.ListingDataUpdate) {
                if (data?.ListingDataUpdate?.status === 'success') {
                    dispatch({
                        type: GET_BLOCKED_SUCCESS,
                    });
                    return true;
                } else {
                    return false;
                }
            }

        } catch (error) {
            dispatch({
                type: GET_BLOCKED_ERROR,
                payload: {
                    error
                }
            });
        }
    };
}