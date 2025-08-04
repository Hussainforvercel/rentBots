import {
  GET_CURRENCIES_START,
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_ERROR
} from '../constants';
import { getCurrencies as query } from '../lib/graphql';

export const getCurrenciesData = () => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: GET_CURRENCIES_START,
      });

      // Send Request to get listing data
      const { data } = await client.query({ query, fetchPolicy: 'network-only' });

      if (data?.getCurrencies) {
        dispatch({
          type: GET_CURRENCIES_SUCCESS,
          availableCurrencies: data.getCurrencies
        });
      }
    } catch (error) {
      dispatch({
        type: GET_CURRENCIES_ERROR,
      });
      return false;
    }

    return true;
  };
}
