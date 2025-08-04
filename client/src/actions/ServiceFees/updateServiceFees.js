import {
  ADMIN_UPDATE_SERVICE_FEES_START,
  ADMIN_UPDATE_SERVICE_FEES_SUCCESS,
  ADMIN_UPDATE_SERVICE_FEES_ERROR,
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getServiceFees as query, updateServiceFees as mutation } from '../../lib/graphql';

export const updateServiceFees = (guestType, guestValue, hostType, hostValue, currency) => {
  return async (dispatch, getState, { client }) => {

    try {

      dispatch({
        type: ADMIN_UPDATE_SERVICE_FEES_START,
      });

      // If admin didn't provide currency, use the base currency
      let baseCurrency = getState().currency.base;
      let currencyData = currency ? currency : baseCurrency;

      const { data } = await client.mutate({
        mutation,
        variables: {
          guestType,
          guestValue,
          hostType,
          hostValue,
          currency: currencyData
        },
        refetchQueries: [{ query }]
      });

      dispatch({
        type: ADMIN_UPDATE_SERVICE_FEES_SUCCESS,
      });
      showToaster({ messageId: 'serviceFeeUpdate', toasterType: 'success' })

    } catch (error) {
      dispatch({
        type: ADMIN_UPDATE_SERVICE_FEES_ERROR,
        payload: {
          error
        }
      });
      showToaster({ messageId: 'serviceFeeUpdateFailed', toasterType: 'error' })
      return false;
    }

    return true;
  };
}