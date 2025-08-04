import {
  ADD_RECOMMEND_START,
  ADD_RECOMMEND_SUCCESS,
  ADD_RECOMMEND_ERROR,
  REMOVE_RECOMMEND_START,
  REMOVE_RECOMMEND_SUCCESS,
  REMOVE_RECOMMEND_ERROR
} from '../../../constants';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { getAllListingsQuery, addRecommendMutation, removeRecommendMutation } from '../../../lib/graphql';

const addListToRecommended = (listId, currentPage, searchList) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: ADD_RECOMMEND_START,
      });

      const { data } = await client.mutate({
        mutation: addRecommendMutation,
        variables: { listId },
        refetchQueries: [{ query: getAllListingsQuery, variables: { currentPage, searchList } }]
      });

      if (data?.addRecommend?.status === "success") {
        dispatch({
          type: ADD_RECOMMEND_SUCCESS,
        });
        showToaster({ messageId: 'addRecommendList', toasterType: 'success' })
      } else {
        dispatch({
          type: ADD_RECOMMEND_ERROR,
          payload: {
            status
          }
        });
        showToaster({ messageId: 'commonError', toasterType: 'error', requestMessage: data?.addRecommend?.errorMessage })
      }
    } catch (error) {
      dispatch({
        type: ADD_RECOMMEND_ERROR,
        payload: {
          error
        }
      });
    }
  };
}

const removeListFromRecommended = (listId, currentPage, searchList) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: REMOVE_RECOMMEND_START,
      });

      const { data } = await client.mutate({
        mutation: removeRecommendMutation,
        variables: { listId },
        refetchQueries: [{ query: getAllListingsQuery, variables: { currentPage, searchList } }]
      });

      if (data?.removeRecommend?.status === "success") {
        dispatch({
          type: REMOVE_RECOMMEND_SUCCESS,
        });
        showToaster({ messageId: 'removeRecommend', toasterType: 'success' })
      } else {
        dispatch({
          type: REMOVE_RECOMMEND_ERROR,
          payload: {
            status: 'something went wrong'
          }
        });
      }
    } catch (error) {
      dispatch({
        type: REMOVE_RECOMMEND_ERROR,
        payload: {
          error
        }
      });
    }
  };
}

export { addListToRecommended, removeListFromRecommended }; 