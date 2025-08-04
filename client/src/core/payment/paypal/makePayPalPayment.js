import axios from 'axios';
import { getConfigurationData } from '../../getConfigurationData';
import { generatePaypalAccessToken } from './generatePaypalAccessToken';
import { payment } from '../../../config-sample';

export async function makePayPalPayment(tokenId) {
    try {
        let configData = await getConfigurationData({ name: ['paypalHost'] });
        const base = configData.paypalHost;

        const { accessToken, status, errorMessage } = await generatePaypalAccessToken();

        if (status !== 200 || !accessToken) {
            return {
                status,
                errorMessage
            }
        }

        const url = `${base}${payment?.paypal?.versions?.versionTwo}${payment?.paypal?.payment_url}/${tokenId}${payment?.paypal?.capture_url}`;
        const response = await axios.post(url, null, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                'Prefer': 'return=representation'
            },
        });
        const data = response?.data;
        const results = data?.purchase_units && data?.purchase_units?.map((unit) => ({
            reservationId: unit?.reference_id,
            receiverEmail: unit?.payee?.email_address,
            receiverId: unit?.payee?.merchant_id,
            transactionId: unit?.payments?.captures[0]?.id,
            total: unit?.payments?.captures[0]?.amount?.value,
            transactionFee: unit?.payments?.captures[0]?.seller_receivable_breakdown?.paypal_fee?.value,
            currency_code: unit?.payments?.captures[0]?.amount?.currency_code
        }));

        if (response?.status == 201 || 200) {
            return ({ status: 200, data, results, errorMessage: null });
        } else {
            return ({ status: 400, errorMessage: data?.message });
        }
    } catch (error) {
        console.error("Error capturing PayPal payment:", error);
        return (
            {
                status: 400,
                errorMessage: error?.response?.data?.message || error?.response?.data?.error_description || "Oops!, something went wrong, please try again."
            }
        )
    }
}
