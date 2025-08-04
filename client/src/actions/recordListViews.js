import {
  RECORD_LIST_VIEWS_START,
  RECORD_LIST_VIEWS_SUCCESS,
  RECORD_LIST_VIEWS_ERROR,
} from '../constants';
import { updateListViews as mutation } from '../lib/graphql';

export const doRecordListViews = (listId) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: RECORD_LIST_VIEWS_START });

      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
        },

      });

      if (data?.UpdateListViews?.status === 'success') {
        dispatch({ type: RECORD_LIST_VIEWS_SUCCESS });
      } else {
        dispatch({
          type: RECORD_LIST_VIEWS_ERROR,
          payload: {
            status: data.UpdateListViews.status,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: RECORD_LIST_VIEWS_ERROR,
        payload: {
          error,
        },
      });
    }
  };
}
