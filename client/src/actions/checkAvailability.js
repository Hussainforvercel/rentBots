import moment from 'moment';
import {
  CHECK_AVAILABLE_DATES_START,
  CHECK_AVAILABLE_DATES_SUCCESS,
  CHECK_AVAILABLE_DATES_ERROR
} from '../constants';
import { dateAvailability as query } from '../lib/graphql';

export const checkAvailability = (listId, startDate, endDate, maximumNights, startTime, endTime, minimumNights) => {
  return async (dispatch, getState, { client }) => {
    dispatch({
      type: CHECK_AVAILABLE_DATES_START,
      isLoading: true,
      payload: {
        maximumStay: false,
        minimumStay: false
      }
    });

    startTime = isNaN(startTime) ? 0 : Number(startTime);
    endTime = isNaN(endTime) ? 0 : Number(endTime);

    if ((minimumNights > 0 || maximumNights > 0) && startDate && endDate && (startTime >= 0 || startTime == '0') && (endTime >= 0 || endTime == '0')) {

      let momentStartDate, momentEndDate, dayDifference;
      momentStartDate = moment(startDate);
      momentEndDate = moment(endDate);
      dayDifference = momentEndDate.diff(momentStartDate, 'days');

      if (dayDifference == 1) {
        dayDifference = (Number((24 - startTime)) + Number(endTime)) <= 24 ? 1 : 2;
      } else { dayDifference += 1; }

      if (dayDifference < minimumNights || dayDifference > maximumNights) {
        dispatch({
          type: CHECK_AVAILABLE_DATES_SUCCESS,
          isLoading: false,
          payload: {
            minimumStay: minimumNights > 0 && dayDifference < minimumNights ? true : false,
            maximumStay: maximumNights > 0 && dayDifference > maximumNights ? true : false
          }
        });
        return true;
      }
    }

    try {
      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId, startDate, endDate },
        fetchPolicy: 'network-only',
      });

      if (data?.DateAvailability) {
        let availability = true;
        if (data.DateAvailability.status === 'NotAvailable') {
          availability = false;
        }
        dispatch({
          type: CHECK_AVAILABLE_DATES_SUCCESS,
          isLoading: false,
          availability,
          payload: {
            maximumStay: false,
            minimumStay: false
          }
        });
      } else {
        dispatch({
          type: CHECK_AVAILABLE_DATES_ERROR,
          isLoading: false,
          availability: false
        });
      }
    } catch (error) {
      dispatch({
        type: CHECK_AVAILABLE_DATES_ERROR,
        payload: {
          error,
        },
        isLoading: false,
      });
      return false;
    }

    return true;
  };
}
