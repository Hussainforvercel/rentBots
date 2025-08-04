import {
  CHANGE_CURRENCY_STATUS_START,
  CHANGE_CURRENCY_STATUS_SUCCESS,
  CHANGE_CURRENCY_STATUS_ERROR,
  SET_BASE_CURRENCY_START,
  SET_BASE_CURRENCY_SUCCESS,
  SET_BASE_CURRENCY_ERROR
} from '../../../constants';
import {
  getBaseCurrencyQuery, currencyManagementMutation, setBaseCurrencyMutation,
  getAllCurrencyQuery
} from '../../../lib/graphql';
import showToaster from '../../../helpers/toasterMessages/showToaster'

const updateCurrencyStatus = (id, isEnable) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: CHANGE_CURRENCY_STATUS_START,
      });

      let baseCurrencyId;
      const { data } = await client.query({ query: getBaseCurrencyQuery, fetchPolicy: 'network-only' });

      if (data?.getBaseCurrency) {
        baseCurrencyId = data?.getBaseCurrency?.id;
      }

      if (baseCurrencyId === id) {
        showToaster({ messageId: 'disableBaseCurrencyError', toasterType: 'error' })
      } else {

        const { data } = await client.mutate({
          mutation: currencyManagementMutation,
          variables: { id, isEnable },
          refetchQueries: [{ query: getAllCurrencyQuery }]
        });

        if (data.currencyManagement.status === "success") {
          dispatch({
            type: CHANGE_CURRENCY_STATUS_SUCCESS,
          });
          showToaster({ messageId: 'currencyStatusSuccess', toasterType: 'success' })
        }
      }

    } catch (error) {

      dispatch({
        type: CHANGE_CURRENCY_STATUS_ERROR,
        payload: {
          error
        }
      });
      showToaster({ messageId: 'currencyStatusFailed', toasterType: 'error' })
      return false;
    }
    return true;
  };
}

const setBaseCurrency = (id) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: SET_BASE_CURRENCY_START,
      });

      const { data } = await client.mutate({
        mutation: setBaseCurrencyMutation,
        variables: { id },
        refetchQueries: [{ query: getAllCurrencyQuery }]
      });

      if (data?.baseCurrency?.status === "success") {
        dispatch({
          type: SET_BASE_CURRENCY_SUCCESS,
        });
        showToaster({ messageId: 'setDefaultBaseCurrency', toasterType: 'success' })
      }

    } catch (error) {
      dispatch({
        type: SET_BASE_CURRENCY_ERROR,
        payload: {
          error
        }
      });
      showToaster({ messageId: 'setDefaultBaseCurrencyFailed', toasterType: 'error' })
      return false;
    }
    return true;
  };
}

export { updateCurrencyStatus, setBaseCurrency };