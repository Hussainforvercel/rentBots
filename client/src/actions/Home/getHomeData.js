import {
  GET_HOME_START,
  GET_HOME_SUCCESS,
  GET_HOME_ERROR
} from '../../constants';
import { getHomeData as query } from '../../lib/graphql';

export const getHomeData = () => {
  console.log(GET_HOME_ERROR)
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: GET_HOME_START,
      });

      const { data } = await client.query({
        query,
        fetchPolicy: 'network-only'
      });
      console.log("data", data)
      dispatch({
        type: data?.getHomeData && data?.getHomeData?.result ? GET_HOME_SUCCESS : GET_HOME_ERROR,
        data: data?.getHomeData && data?.getHomeData?.result ? data?.getHomeData?.result : []
      });

    } catch (error) {
      dispatch({
        type: GET_HOME_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
