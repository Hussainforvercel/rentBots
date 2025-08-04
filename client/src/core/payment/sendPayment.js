import fetch from '../fetch';

export async function sendPayment(reservationId, amount, currency, description) {

    const resp = await fetch('/paynow', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reservationId, amount, currency, description }),
        credentials: 'include'
    });
    const { redirect, status, errorMessage } = await resp.json();
    if (status == 200 && redirect) {
        window.location = redirect;
    }

    return await {
        status,
        errorMessage,
    }

}
