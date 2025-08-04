import { initialize } from 'redux-form';
import {
  GET_LOCATION_DATA_START,
  GET_LOCATION_DATA_SUCCESS,
  GET_LOCATION_DATA_ERROR,
  UPDATE_LOCATION_STATUS
} from '../constants';
import { locationItem as query } from '../lib/graphql';

const getLocationData = (address) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_LOCATION_DATA_START,
        isLocationChosen: true,
      });

      // Send Request Google API get detailed address
      const { data } = await client.query({
        query,
        variables: { address },
        fetchPolicy: 'network-only'
      });

      // Collect Current form data
      const formData = getState().form.ListPlaceStep1.values

      // Combine Existing Values with location data
      const formValues = Object.assign({}, formData, data.locationItem);

      // Reinitialize the form values
      dispatch(initialize("ListPlaceStep1", formValues, true));

      // Dispatch a success action
      dispatch({
        type: GET_LOCATION_DATA_SUCCESS,
      });

    } catch (error) {
      dispatch({
        type: GET_LOCATION_DATA_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}

const updateLocationStatus = () => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LOCATION_STATUS,
      isLocationChosen: true
    });
  };
}

export { getLocationData, updateLocationStatus };
