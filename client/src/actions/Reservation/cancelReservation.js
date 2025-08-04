import {
  CANCEL_RESERVATION_START,
  CANCEL_RESERVATION_SUCCESS,
  CANCEL_RESERVATION_STATE_ERROR
} from '../../constants';
import history from '../../core/history';
import { sendEmail } from '../../core/email/sendEmail';
import { decode } from '../../helpers/queryEncryption';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { cancelReservation as mutation } from '../../lib/graphql';

export const cancel = (
  reservationId,
  cancellationPolicy,
  refundToGuest,
  payoutToHost,
  guestServiceFee,
  hostServiceFee,
  total,
  currency,
  threadId,
  cancelledBy,
  message,
  checkIn,
  checkOut,
  guests,
  listTitle,
  confirmationCode,
  hostName,
  guestName,
  hostEmail,
  guestEmail,
  startTime,
  endTime
) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: CANCEL_RESERVATION_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          reservationId,
          cancellationPolicy,
          refundToGuest,
          payoutToHost,
          guestServiceFee,
          hostServiceFee,
          total,
          currency,
          threadId,
          cancelledBy,
          message,
          checkIn,
          checkOut,
          guests,
          startTime,
          endTime
        }
      });

      if (data?.cancelReservation?.status === '200') {
        dispatch({
          type: CANCEL_RESERVATION_SUCCESS,
        });

        if (cancelledBy === 'owner') {
          history.push('/reservation/current');
          let content = {
            hostName,
            guestName,
            confirmationCode,
            checkIn,
            listTitle,
            refundToGuest,
            currency
          };
          showToaster({ messageId: 'reservationCancelled', toasterType: 'success' })
          sendEmail(decode(guestEmail), 'cancelledByHost', content);
        } else {
          history.push('/trips/current');
          let content = {
            hostName,
            guestName,
            confirmationCode,
            checkIn,
            listTitle,
            payoutToHost,
            currency
          };
          showToaster({ messageId: 'tripCancelled', toasterType: 'success' })
          sendEmail(decode(hostEmail), 'cancelledByGuest', content);
        }

      }

      if (data?.cancelReservation?.status === '400') {
        dispatch({
          type: CANCEL_RESERVATION_SUCCESS,
        });
        showToaster({ messageId: 'cancelReservationSuccess', toasterType: 'error' })
      }

    } catch (error) {
      dispatch({
        type: CANCEL_RESERVATION_STATE_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}