import {
  UPDATE_RESERVATION_STATE_START,
  UPDATE_RESERVATION_STATE_SUCCESS,
  UPDATE_RESERVATION_STATE_ERROR
} from '../../constants';
import { sendEmail } from '../../core/email/sendEmail';
import { decode } from '../../helpers/queryEncryption';
import getAllReservationQuery from '../../components/ManageReservation/getAllReservationQuery.graphql';
import { updateReservation as mutation, reservationQuery } from '../../lib/graphql';

export const updateReservation = (reservationId, actionType, userType, threadId, currentPage, searchKey, listIdKey, startDate, endDate, orderBy, dateFilter) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: UPDATE_RESERVATION_STATE_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          reservationId,
          actionType,
          threadId
        },
        refetchQueries: [
          {
            query: getAllReservationQuery,
            variables: {
              userType,
              searchKey,
              listId: listIdKey,
              startDate,
              endDate,
              currentPage,
              orderBy,
              dateFilter
            },
          }
        ]
      });

      if (data?.updateReservation?.status === '200') {

        const reservation = await client.query({
          query: reservationQuery,
          variables: {
            reservationId,
          },
          fetchPolicy: 'network-only'
        });
        let content;

        if (reservation?.data?.getItinerary) {
          let reservationState, confirmationCode, checkIn, hostName, hostEmail;
          let guestName, guestEmail, listTitle, listCity, threadId;

          reservationState = reservation?.data?.getItinerary?.reservationState;
          confirmationCode = reservation?.data?.getItinerary?.confirmationCode;
          checkIn = reservation?.data?.getItinerary?.checkIn;
          hostName = reservation?.data?.getItinerary?.hostData?.firstName;
          hostEmail = reservation?.data?.getItinerary?.hostData?.userData?.email;
          guestName = reservation?.data?.getItinerary?.guestData?.firstName;
          guestEmail = decode(reservation?.data?.getItinerary?.guestData?.userData?.email);
          listTitle = reservation?.data?.getItinerary?.listData?.title;
          listCity = reservation?.data?.getItinerary?.listData?.city;
          threadId = reservation?.data?.getItinerary?.messageData?.id;

          if (reservationState === 'approved') {
            content = {
              hostName,
              guestName,
              listTitle,
              listCity,
              threadId
            };
            sendEmail(guestEmail, 'bookingConfirmedToGuest', content);
          }
          if (reservationState === 'declined') {
            content = {
              hostName,
              guestName,
              checkIn,
              confirmationCode
            };
            sendEmail(guestEmail, 'bookingDeclinedToGuest', content);
          }
        }

        dispatch({
          type: UPDATE_RESERVATION_STATE_SUCCESS,
        });
      }
    } catch (error) {
      dispatch({
        type: UPDATE_RESERVATION_STATE_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}