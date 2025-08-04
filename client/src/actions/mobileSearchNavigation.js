import {
  SHOW_SEARCH_RESULTS_MAP,
  SHOW_SEARCH_RESULTS,
  SHOW_SEARCH_FORM,
} from '../constants';

const showMap = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_SEARCH_RESULTS_MAP,
      payload: {
        searchMap: true,
        searchResults: false,
        searchForm: false,
        searchFilter: false
      }
    });
    return true;
  };
};

const showResults = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_SEARCH_RESULTS,
      payload: {
        searchMap: false,
        searchResults: true,
        searchForm: false,
        searchFilter: false
      }
    });
    return true;
  };
};

const showForm = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_SEARCH_FORM,
      payload: {
        searchMap: false,
        searchResults: false,
        searchForm: true,
        searchFilter: false
      }
    });
    return true;
  };
};

const showFilter = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_SEARCH_FORM,
      payload: {
        searchMap: false,
        searchResults: false,
        searchForm: true,
        searchFilter: true
      }
    });
    return true;
  };
};

export { showMap, showResults, showForm, showFilter };
