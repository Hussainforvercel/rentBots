import {
  MANAGE_LISTING_STEPS_DATA_START,
  MANAGE_LISTING_STEPS_DATA_SUCCESS,
  MANAGE_LISTING_STEPS_DATA_ERROR
} from '../constants';
import { manageListingSteps as query } from '../lib/graphql';

export const manageListingSteps = (listId, currentStep) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: MANAGE_LISTING_STEPS_DATA_START,
      });

      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId, currentStep },
        fetchPolicy: 'network-only'
      });

      if (data?.ManageListingSteps) {
        dispatch({
          type: MANAGE_LISTING_STEPS_DATA_SUCCESS,
          listingSteps: data.ManageListingSteps
        });
      } else {
        dispatch({
          type: MANAGE_LISTING_STEPS_DATA_ERROR,
        });
        return false;
      }

    } catch (error) {
      dispatch({
        type: MANAGE_LISTING_STEPS_DATA_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
