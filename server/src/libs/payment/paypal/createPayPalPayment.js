import axios from 'axios';
import { payment } from '../../../config.js';
import { getConfigurationData } from '../../getConfigurationData.js';
import { generatePaypalAccessToken } from './generatePaypalAccessToken.js';
import { isUnSupportedDecimalCurrency } from '../../../helpers/zeroDecimalCurrency.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

export async function createPayPalPayment(reservationId, total, currency) {

  let configData = await getConfigurationData({ name: ['paypalHost'] });
  const base = configData.paypalHost;
  const { accessToken, status, errorMessage } = await generatePaypalAccessToken();

  if (status !== 200 || !accessToken) {
    return {
      status,
      errorMessage
    }
  }
  const url = `${base}${payment.paypal.versions.versionTwo}${payment.paypal.payment_url}`;
  const amount = isUnSupportedDecimalCurrency(currency) ? Math.round(total) : total;
  const purchaseUnits = [
    {
      amount: {
        currency_code: currency,
        value: amount
      }
    },
  ];
  purchaseUnits[0].reference_id = reservationId;

  const params = JSON.stringify({
    intent: 'CAPTURE',
    purchase_units: purchaseUnits,
    payment_source: {
      paypal: {
        experience_context: {
          return_url: payment.paypal.returnURL,
          cancel_url: payment.paypal.cancelURL
        }
      }
    }
  });

  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = response.data;
    if (response.status == 201 || 200) {
      return ({ status: 200, data, errorMessage: null });
    } else {
      return ({ status: 400, errorMessage: data.message });
    }
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    return (
      {
        status: error.response.status ? error.response.status : 400,
        errorMessage: error.response.data.message || error.response.data.error_description || await showErrorMessage({ errorCode: 'processError' })
      }
    )
  }
}