import { initialize, change } from 'redux-form';
import {
  GET_LISTING_DATA_START,
  GET_LISTING_DATA_SUCCESS,
  GET_LISTING_DATA_ERROR
} from '../constants';
import { userListingQuery as query } from '../lib/graphql';

export const getListingData = (listId) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_LISTING_DATA_START,
      });

      const { data } = await client.query({
        query,
        variables: { listId, preview: true },
        fetchPolicy: 'network-only',
      });

      let formValues = null, settingFieldsData = {}, bedTypes = [];
      const amenities = [], safetyAmenities = [], carFeatures = [];

      if (data?.UserListing) {
        // Preparing for list settings data
        data.UserListing.settingsData.map((item, value) => {
          settingFieldsData[item?.listsettings?.settingsType?.typeName] = item?.settingsId;
        });

        // Preparing for user amenities
        if (data?.UserListing?.userAmenities?.length > 0) {
          data.UserListing.userAmenities.map((item, value) => {
            carFeatures.push(parseInt(item.amenitiesId));
          });
          settingFieldsData = Object.assign({}, settingFieldsData, { carFeatures });
        }

        // Preparing for user safety amenities
        if (data?.UserListing?.userSafetyAmenities?.length > 0) {
          data.UserListing.userSafetyAmenities.map((item, value) => {
            safetyAmenities.push(parseInt(item.safetyAmenitiesId));
          });
          settingFieldsData = Object.assign({}, settingFieldsData, { safetyAmenities });
        }

        // Preparing for User Spaces
        if (data?.UserListing?.userSpaces?.length > 0) {
          data.UserListing.userSpaces.map((item, value) => {
            carFeatures.push(parseInt(item.spacesId));
          });
          settingFieldsData = Object.assign({}, settingFieldsData, { carFeatures });
        }

        bedTypes = data?.UserListing?.userBedsTypes;
        settingFieldsData = Object.assign({}, settingFieldsData, { bedTypes });

        // Combining values for initializing the edit form
        formValues = Object.assign({}, data.UserListing, settingFieldsData);
        dispatch(change('ListPlaceStep1', 'lat', data.UserListing.lat));
        dispatch(change('ListPlaceStep1', 'lng', data.UserListing.lng));
        if (formValues != null) {
          // Reinitialize the form values
          dispatch(initialize('ListPlaceStep1', formValues, true));
          // Dispatch a success action
          dispatch({
            type: GET_LISTING_DATA_SUCCESS,
            step1DataIsLoaded: true,
            isExistingList: true,
            initialValuesLoaded: false,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: GET_LISTING_DATA_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}