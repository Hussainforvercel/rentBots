import {
  SEND_MESSAGE_START,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
} from '../../constants';
import { updateReservation } from '../Reservation/updateReservation';
import { sendEmail } from '../../core/email/sendEmail';
import { setLoaderStart, setLoaderComplete } from '../loader/loader';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { threadItemsQuery, sendMessage as mutation } from '../../lib/graphql';

export const sendMessageAction = (
  threadId,
  threadType,
  content,
  type,
  startDate,
  endDate,
  personCapacity,
  reservationId,
  receiverName,
  senderName,
  receiverType,
  receiverEmail,
  startTime,
  endTime,
  currentPage,
  searchKey,
  listIdKey,
  startDateFilter,
  endDateFilter,
  orderBy,
  dateFilter
) => {
  return async (dispatch, getState, { client }) => {
    try {

      dispatch(setLoaderStart('hostAction'));
      dispatch({
        type: SEND_MESSAGE_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          threadId,
          content,
          type,
          startDate,
          endDate,
          personCapacity,
          reservationId,
          startTime,
          endTime
        },
        refetchQueries: [
          {
            query: threadItemsQuery,
            variables: {
              threadId,
              threadType
            },
          }
        ]
      });

      if (data?.sendMessage?.status == 'alreadyPerformed') {
        showToaster({ messageId: 'alreadyPerformedAction', toasterType: 'error' })
        dispatch({
          type: SEND_MESSAGE_ERROR,
        });
      } else if (data?.sendMessage?.status != 'userbanned') {
        if (reservationId != null && reservationId != undefined) {
          dispatch(updateReservation(reservationId, type, threadType, threadId, currentPage, searchKey, listIdKey, startDateFilter, endDateFilter, orderBy, dateFilter));
        }

        dispatch({
          type: SEND_MESSAGE_SUCCESS,
        });

        if (type === 'message') {
          let emailContent = {
            receiverName,
            senderName,
            receiverType,
            type: receiverType,
            message: content,
            threadId
          };
          sendEmail(receiverEmail, 'message', emailContent);
        }
      }
      dispatch(setLoaderComplete('hostAction'));
    } catch (error) {
      dispatch({
        type: SEND_MESSAGE_ERROR,
        payload: {
          error
        }
      });
      dispatch(setLoaderComplete('hostAction'));
      return false;
    }
    return true;
  };
}