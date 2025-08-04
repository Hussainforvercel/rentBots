import {
  SET_STICKY_TOP,
  SET_STICKY_BOTTOM
} from '../../constants';

const setStickyTop = (value) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_STICKY_TOP,
      payload: {
        stickyTop: value,
      }
    });
  };
}

const setStickyBottom = (value) => {
  return (dispatch, getState) => {
    dispatch({
      type: SET_STICKY_BOTTOM,
      payload: {
        stickyBottom: value,
      }
    });
  };
}

export { setStickyTop, setStickyBottom };
