import {
  CONTACT_HOST_START,
  CONTACT_HOST_SUCCESS,
  CONTACT_HOST_ERROR,
} from '../../constants';
import { sendEmail } from '../../core/email/sendEmail';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { createThreadItems as mutation } from '../../lib/graphql';

export const contactHost = (
  listId,
  host,
  content,
  startDate,
  endDate,
  personCapacity,
  hostEmail,
  firstName,
  startTime,
  endTime,
) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: CONTACT_HOST_START,
      });

      let account = getState().account.data;

      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          host,
          content,
          type: 'inquiry',
          startDate,
          endDate,
          personCapacity,
          startTime,
          endTime,
        }
      });

      let timeStart, timeEnd;

      if (startTime.includes('.')) {
        timeStart = startTime && startTime.length == '3' ? '0' + startTime.slice(0, 1) + ':30:00' : startTime && startTime.slice(0, 2) + ':30:00'
      } else {
        timeStart = startTime && startTime.length == '1' ? '0' + startTime.slice(0, 1) + ':00:00' : startTime && startTime.slice(0, 2) + ':00:00'
      }

      if (endTime.includes('.')) {
        timeEnd = endTime && endTime.length == '3' ? '0' + endTime.slice(0, 1) + ':30:00' : endTime && endTime.slice(0, 2) + ':30:00'
      } else {
        timeEnd = endTime && endTime.length == '1' ? '0' + endTime.slice(0, 1) + ':00:00' : endTime && endTime.slice(0, 2) + ':00:00'
      }

      let emailContent = {
        receiverName: firstName,
        senderName: account.firstName,
        type: 'owner',
        message: content,
        threadId: data.CreateThreadItems.threadId,
        checkIn: startDate,
        checkOut: endDate,
        personCapacity,
        startTime: timeStart,
        endTime: timeEnd
      };

      if (data?.CreateThreadItems) {
        dispatch({
          type: CONTACT_HOST_SUCCESS,
        });
        showToaster({ messageId: 'contactHost', toasterType: 'success' })
        sendEmail(hostEmail, 'inquiry', emailContent);
      }

    } catch (error) {
      dispatch({
        type: CONTACT_HOST_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}