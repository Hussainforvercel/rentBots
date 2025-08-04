import {
  LOADING_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_START,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_ERROR,
} from '../constants';

const getSearchResults = (data) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: FETCH_SEARCH_RESULTS_START,
      });

      if (data) {
        // Dispatch a success action
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          payload: {
            data,
            isResultLoading: false
          }
        });
      } else {
        dispatch({
          type: FETCH_SEARCH_RESULTS_ERROR,
          payload: {
            isResultLoading: false
          }
        });
      }

    } catch (error) {
      dispatch({
        type: FETCH_SEARCH_RESULTS_ERROR,
        payload: {
          error,
          isResultLoading: false
        }
      });
      return false;
    }
    return true;
  };
}

const loadingSearchResults = () => {
  return (dispatch) => {
    dispatch({
      type: LOADING_SEARCH_RESULTS,
      payload: {
        isResultLoading: true
      }
    });
  };
}

export { getSearchResults, loadingSearchResults };