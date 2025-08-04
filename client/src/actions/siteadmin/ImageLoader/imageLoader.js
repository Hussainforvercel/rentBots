export const getImageLoader = (actionType, data) => {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: actionType,
      payload: {
        loader: data
      }
    });

  };

}
