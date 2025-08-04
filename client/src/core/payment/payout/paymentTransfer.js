
import axios from 'axios';
import { getConfigurationData } from '../../getConfigurationData';
import { generatePaypalAccessToken } from '../paypal/generatePaypalAccessToken';
import { isUnSupportedDecimalCurrency } from '../../../helpers/zeroDecimalCurrency';
import { payment } from '../../../config-sample';

export async function paymentTransfer(id, amount, currency, email) {
    try {
        let configData = await getConfigurationData({ name: ['paypalHost'] });
        const base = configData?.paypalHost;

        const { accessToken, status, errorMessage } = await generatePaypalAccessToken();

        if (status !== 200 || !accessToken) {
            return {
                status,
                errorMessage
            }
        }

        const url = `${base}${payment?.paypal?.versions?.versionOne}${payment?.paypal?.payout_url}`

        const total = isUnSupportedDecimalCurrency(currency) ? Math.round(amount) : amount;

        let sender_batch_id = Math.random().toString(36).substring(9);
        const params = JSON.stringify({
            sender_batch_header:
            {
                sender_batch_id: sender_batch_id,
                email_subject: "You have a payout!",
                email_message: "You have received a payout! Thanks for using our service!"
            },
            items: [
                {
                    recipient_type: "EMAIL",
                    amount:
                    {
                        value: total,
                        currency: currency
                    },
                    note: "Thanks for your patronage!",
                    sender_item_id: id,
                    receiver: email,
                    recipient_wallet: "PAYPAL"
                }]
        });
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = response?.data;
        if (response?.status == 201 || 200) {
            return ({ status: 200, data, errorMessage: null });
        } else {
            return ({ status: 400, errorMessage: data?.batch_header?.batch_status });
        }
    } catch (error) {
        console.error("Error capturing PayPal payout details:", error);
        return (
            {
                status: 400,
                errorMessage: error?.response?.data?.message || error?.response?.data?.error_description || "Oops!, something went wrong, please try again."
            }
        )
    }
}
