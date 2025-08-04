import history from '../../core/history';
import {
  BOOKING_PROCESS_START,
  BOOKING_PROCESS_SUCCESS,
  BOOKING_PROCESS_ERROR,
} from '../../constants';
import { loadAccount } from '../account';
import { userListing as query } from '../../lib/graphql';

export const bookingProcess = (
  listId, guests, startDate,
  endDate, preApprove, startTime,isSingleDate,hourlyPrice,
  endTime, deliveryStatus, roomType) => {

  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: BOOKING_PROCESS_START,
        payload: {
          bookingLoading: true
        }
      });

      const { data } = await client.query({
        query,
        variables: {
          listId
        },
        fetchPolicy: 'network-only'
      });

      if (data?.UserListing) {
        dispatch({
          type: BOOKING_PROCESS_SUCCESS,
          payload: {
            data: data.UserListing,
            bookDetails: {
              guests,
              startDate,
              endDate,
              preApprove,
              isSingleDate,hourlyPrice,
              startTime,
              endTime,
              deliveryStatus,
              roomType
            },
            bookingLoading: false
          }
        });
        dispatch(loadAccount());

        history.push('/book/' + listId);
      } else if (data?.UserListing == null) {
        window.location.reload();
      }

    } catch (error) {
      dispatch({
        type: BOOKING_PROCESS_ERROR,
        payload: {
          error,
          bookingLoading: false
        }
      });
      return false;
    }
    return true;
  };
}