import axios from 'axios';
import { getConfigurationData } from '../../getConfigurationData';
import { generatePaypalAccessToken } from '../paypal/generatePaypalAccessToken';
import { payment } from '../../../config-sample';

export async function getTransactionFee(batchId) {
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
        const url = `${base}${payment?.paypal?.versions?.versionOne}${payment?.paypal?.payout_url}/${batchId}`;

        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = response?.data;
        return data;
    } catch (error) {
        console.error("Error capturing Payout payment:", error);
        return { status: 400, errorMessage: error?.message };
    }
}