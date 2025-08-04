import {
  GET_LISTING_FIELDS_DATA_START,
  GET_LISTING_FIELDS_DATA_SUCCESS,
  GET_LISTING_FIELDS_DATA_ERROR
} from '../constants';
import { getListingSettings as query } from '../lib/graphql';

export const getListingFields = () => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_LISTING_FIELDS_DATA_START,
      });

      // Send Request to get listing data
      const { data } = await client.query({ query, fetchPolicy: 'network-only' });

      let listingFields = {};

      if (!data && !data.getListingSettings) {
        dispatch({
          type: GET_LISTING_FIELDS_DATA_ERROR,
        });
      } else {
        data.getListingSettings.map((item, key) => {
          listingFields[item.typeName] = item.listSettings;
        })
        dispatch({
          type: GET_LISTING_FIELDS_DATA_SUCCESS,
          listingFields: listingFields
        });
      }
    } catch (error) {
      dispatch({
        type: GET_LISTING_FIELDS_DATA_ERROR,
        payload: {
          error
        }
      });
      return false;
    }
    return true;
  };
}
