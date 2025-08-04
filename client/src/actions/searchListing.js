import { reset, change } from 'redux-form';
import {
  SEARCH_LISTING_START,
  SEARCH_LISTING_SUCCESS,
  SEARCH_LISTING_ERROR
} from '../constants';
import { getSearchResults } from './getSearchResults';
import { searchListing as query } from '../lib/graphql';

export const searchListing = ({ personCapacity, dates, geography, currentPage, geoType, lat, lng, sw_lat, sw_lng, ne_lat, ne_lng }) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({ type: SEARCH_LISTING_START });
      dispatch(reset('SearchForm'));

      const { data } = await client.query({
        query,
        variables: {
          personCapacity,
          dates,
          currentPage,
          geography,
          geoType,
          lat,
          lng,
          sw_lat,
          sw_lng,
          ne_lat,
          ne_lng
        },
        fetchPolicy: 'network-only'
      });
      if (data?.SearchListing) {
        dispatch({ type: SEARCH_LISTING_SUCCESS });
        await dispatch(change('SearchForm', 'personCapacity', personCapacity));
        await dispatch(change('SearchForm', 'dates', dates));
        await dispatch(change('SearchForm', 'geography', geography));
        await dispatch(change('SearchForm', 'currentPage', currentPage));
        await dispatch(change('SearchForm', 'geoType', geoType));
        await dispatch(change('SearchForm', 'lat', lat));
        await dispatch(change('SearchForm', 'lng', lng));
        await dispatch(change('SearchForm', 'searchByMap', false));
        await dispatch(change('SearchForm', 'sw_lat', sw_lat));
        await dispatch(change('SearchForm', 'sw_lng', sw_lng));
        await dispatch(change('SearchForm', 'ne_lat', ne_lat));
        await dispatch(change('SearchForm', 'ne_lng', ne_lng));
        await dispatch(change('SearchForm', 'initialLoad', true));
        await dispatch(change('SearchForm', 'markerHighlight', {}));
        // Default Map Show
        await dispatch(change('SearchForm', 'showMap', true));
        dispatch(getSearchResults(data.SearchListing));
      }
    } catch (error) {
      dispatch({
        type: SEARCH_LISTING_ERROR,
        payload: {
          error: {
            name: error.name || 'Error',
            message: error.message || 'An error occurred during search',
            stack: error.stack || ''
          }
        }
      });
      return false;
    }
    return true;
  };
}
