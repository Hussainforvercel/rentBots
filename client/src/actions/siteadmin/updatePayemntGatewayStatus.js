import {
    SET_PAYMENT_GATEWAY_STATUS_START,
    SET_PAYMENT_GATEWAY_STATUS_SUCCESS,
    SET_PAYMENT_GATEWAY_STATUS_ERROR
} from '../../constants';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { getAllPaymentMethods as query, updatePaymentGateWayStatus as mutation } from '../../lib/graphql';

export const updatePaymentGatewayStatus = (id, isEnable) => {
    return async (dispatch, getState, { client }) => {

        try {
            dispatch({
                type: SET_PAYMENT_GATEWAY_STATUS_START
            });

            const { data } = await client.mutate({
                mutation,
                variables: {
                    id,
                    isEnable
                },
                refetchQueries: [{ query }]
            });

            let activeStatus = isEnable ? 'activated' : 'de-activated';
            if (data?.updatePaymentGatewayStatus?.status == 200) {
                dispatch({
                    type: SET_PAYMENT_GATEWAY_STATUS_SUCCESS
                });

                if (id == 1) {
                    showToaster({ messageId: 'paypalPaymentGateway', toasterType: 'success', requestMessage: activeStatus })
                } else {
                    showToaster({ messageId: 'stripePaymentGateway', toasterType: 'success', requestMessage: activeStatus })
                }
                return true;
            } else if (data?.updatePaymentGatewayStatus?.status == 400) {
                dispatch({
                    type: SET_PAYMENT_GATEWAY_STATUS_ERROR
                });

                showToaster({ messageId: 'paymentGatewayStatusFailed', toasterType: 'error' })
            } else if (data?.updatePaymentGatewayStatus?.status == 'Atleast one option must be active') {
                dispatch({
                    type: SET_PAYMENT_GATEWAY_STATUS_ERROR
                });

                showToaster({ messageId: 'paymentGatewayStatus', toasterType: 'error' })
            }

        } catch (error) {
            dispatch({
                type: SET_PAYMENT_GATEWAY_STATUS_ERROR
            });
            showToaster({ messageId: 'paymentGatewayStatusFailed', toasterType: 'error' })
        }
    }
}