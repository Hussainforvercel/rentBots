import axios from 'axios';
import { getConfigurationData } from '../../getConfigurationData';
import { payment } from '../../../config-sample';

export async function generatePaypalAccessToken() {
    let configData = await getConfigurationData({ name: ['paypalClientId', 'paypalSecret', 'paypalHost'] });
    let CLIENT_ID = configData?.paypalClientId, APP_SECRET = configData?.paypalSecret;
    const base = configData.paypalHost;
    const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64');
    try {
        const response = await axios.post(`${base}${payment?.paypal?.versions?.versionOne}${payment?.paypal?.token_url}`, 'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${auth}`,
            },
        });
        const data = response?.data;
        return {
            status: 200,
            accessToken: data.access_token
        };

    } catch (error) {
        console.error("Error generating PayPal access token:", error);
        return (
            {
                status: 400,
                errorMessage: error?.response?.data?.message || error?.response?.data?.error_description || "Oops!, something went wrong, please try again."
            }
        )
    }
}