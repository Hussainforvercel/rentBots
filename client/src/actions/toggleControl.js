import { change } from 'redux-form';
import {
  SEARCH_FILTER_TOGGLE_OPEN,
  SEARCH_FILTER_TOGGLE_CLOSE
} from '../constants';

const openSearchFilter = () => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_FILTER_TOGGLE_OPEN,
      payload: {
        filterToggle: true
      }
    });
    return true;
  };
};

const closeSearchFilter = () => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_FILTER_TOGGLE_CLOSE,
      payload: {
        filterToggle: false
      }
    });
    dispatch(change('SearchForm', 'amenities', []));
    dispatch(change('SearchForm', 'spaces', []));
    dispatch(change('SearchForm', 'houseRules', []));
    return true;
  };
};

const closeAndSubmitSearchFilter = () => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_FILTER_TOGGLE_CLOSE,
      payload: {
        filterToggle: false
      }
    });
    return true;
  };
};

export { openSearchFilter, closeSearchFilter, closeAndSubmitSearchFilter };