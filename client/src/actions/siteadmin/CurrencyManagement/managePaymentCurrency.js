import {
  ADMIN_MANAGE_PAYMENT_CURRENCY_START,
  ADMIN_MANAGE_PAYMENT_CURRENCY_SUCCESS,
  ADMIN_MANAGE_PAYMENT_CURRENCY_ERROR,
} from '../../../constants';
import showToaster from '../../../helpers/toasterMessages/showToaster';
import { managePaymentCurrency as mutation, getAllCurrencyQuery } from '../../../lib/graphql';

export const managePaymentCurrency = (currencyId, type) => {
  return async (dispatch, getState, { client }) => {

    try {
      dispatch({
        type: ADMIN_MANAGE_PAYMENT_CURRENCY_START,
      });

      const { data } = await client.mutate({
        mutation,
        variables: {
          currencyId,
          type
        },
        refetchQueries: [{ query: getAllCurrencyQuery }]
      });

      if (data?.managePaymentCurrency) {
        dispatch({
          type: ADMIN_MANAGE_PAYMENT_CURRENCY_SUCCESS,
          payload: {
            status: data.managePaymentCurrency.status
          }
        });
        showToaster({ messageId: 'managePaymentCurrencySuccess', toasterType: 'success' })
      }

    } catch (error) {
      dispatch({
        type: ADMIN_MANAGE_PAYMENT_CURRENCY_ERROR,
        payload: {
          error
        }
      });
      showToaster({ messageId: 'managePaymentCurrencyFailed', toasterType: 'error' })
      return false;
    }

    return true;
  };
}