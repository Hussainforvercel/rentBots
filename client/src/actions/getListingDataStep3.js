import { initialize, change } from 'redux-form';
import {
  GET_LISTING_DATA_STEP3_START,
  GET_LISTING_DATA_STEP3_SUCCESS,
  GET_LISTING_DATA_STEP3_ERROR
} from '../constants';
import { utcTimeFormat } from '../components/ViewListing/ListingDetails/helper';
import { userListingStepThree as query } from '../lib/graphql';

export const getListingDataStep3 = (listId) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_LISTING_DATA_STEP3_START,
      });

      let formValues = null, settingFieldsData = {}, listData = {};
      let calendars = {}, listAvailablePrice = {}, listDataValues;
      const carRules = [], updatedBlockedDates = [], updatedDisabledDates = [];
      const updatedAvailableDates = [], updatedAvailableDatesPrices = [];

      // Send Request to get listing data
      const { data } = await client.query({
        query,
        variables: { listId, preview: true },
        fetchPolicy: 'network-only',
      });

      if (data?.UserListing) {
        console.log(data,"kisting")
        // Preparing List data
        listData = data?.UserListing?.listingData;
        calendars = data?.UserListing?.calendars;
        listAvailablePrice = data?.UserListing?.listAvailablePrice;

        // Preparing for house rules
        if (data?.UserListing?.houseRules?.length > 0) {
          data.UserListing.houseRules.map((item, value) => {
            carRules.push(parseInt(item.houseRulesId));
          });
          settingFieldsData = Object.assign({}, listData, { carRules });
        }

        // Preparing for blocked dates
        if (data?.UserListing?.blockedDates?.length > 0) {
          await data.UserListing.blockedDates.map(async (item, value) => {
            let blockedDate = await utcTimeFormat(item?.blockedDates);

            if (item?.reservationId) {
              updatedDisabledDates.push(blockedDate);
            } if (item.calendarStatus && item.calendarStatus === 'available') {
              updatedAvailableDates.push(blockedDate);
              updatedAvailableDatesPrices.push({
                date: blockedDate,
                isSpecialPrice: item.isSpecialPrice,
                startTime: item.startTime,
                endTime: item.endTime
              });
            } else {
              updatedBlockedDates.push(blockedDate);
            }

          });
          settingFieldsData = Object.assign({}, listData, settingFieldsData,
            {
              disabledDates: updatedDisabledDates,
              blockedDates: updatedBlockedDates,
              availableDates: updatedAvailableDates,
              availableDatesPrices: updatedAvailableDatesPrices,
            });
        }

        await dispatch(change('ListPlaceStep3', 'calendars', calendars));
        if (updatedBlockedDates) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedBlockedDates));
        } else if (updatedAvailableDates) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedAvailableDates));
        } else if (updatedAvailableDatesPrices) {
          await dispatch(change('ListPlaceStep3', 'blockedDates', updatedAvailableDatesPrices));
        }

        // Get current form values from Redux store
        const state = getState();
        const currentValues = state.form?.ListPlaceStep3?.values || {};
        formValues = Object.assign({}, data.UserListing, settingFieldsData, listData, calendars);
        // Reinitialize the form values, merging with current values
        await dispatch(initialize('ListPlaceStep3', { ...currentValues, ...formValues }));
        // Dispatch a success action
        dispatch({
          type: GET_LISTING_DATA_STEP3_SUCCESS,
          step3DataIsLoaded: true,
          isExistingList: true,
          calendars: data.UserListing.calendars
        });
      } else {
        dispatch({
          type: GET_LISTING_DATA_STEP3_ERROR,
        });
      }
    } catch (error) {
      dispatch({
        type: GET_LISTING_DATA_STEP3_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}
