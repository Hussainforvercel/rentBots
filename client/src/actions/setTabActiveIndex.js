import {
  SET_TAB_BAR_ACTIVE_INDEX,
} from '../constants';

const setTabActiveIndex = (index) => {
  return async (dispatch) => {
    dispatch({
      type: SET_TAB_BAR_ACTIVE_INDEX,
      activeIndex: index || 0
    });
    return true;
  };
};

export default setTabActiveIndex;
