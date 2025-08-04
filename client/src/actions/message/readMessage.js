import {
  READ_MESSAGE_START,
  READ_MESSAGE_SUCCESS,
  READ_MESSAGE_ERROR,
} from '../../constants';
import { countQuery, unreadThreadsQuery, inboxQuery, readMessage as mutation } from '../../lib/graphql';

export const readMessage = (threadId, threadType) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: READ_MESSAGE_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          threadId
        },
        refetchQueries: [
          {
            query: countQuery
          },
          {
            query: unreadThreadsQuery
          },
          {
            query: inboxQuery,
            variables: {
              threadId,
              threadType
            }
          }
        ]
      });

      if (data?.sendMessage) {
        dispatch({
          type: READ_MESSAGE_SUCCESS,
        });
      }

    } catch (error) {
      dispatch({
        type: READ_MESSAGE_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}

