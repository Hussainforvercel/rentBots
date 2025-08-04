import fetch from 'node-fetch';  // ES module import syntax
import { websiteUrl } from '../config.js';

export async function sendEmail(to, type, mailContents, isLoggedIn, authToken) {
    let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (isLoggedIn) {
        headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            auth: authToken
        };
    }

    // Validation IsLoggedIn
    if (isLoggedIn && !authToken) {
        return {
            status: 400,
            errorMessage: 'Authentication Token Error!'
        };
    }

    const resp = await fetch(websiteUrl + '/sendEmailTemplate', {
        method: 'post',
        headers,
        body: JSON.stringify({
            to,
            type,
            content: mailContents
        })
    });

    const { status, errorMessage } = await resp.json();  // Use await for json() call

    return {
        status,
        errorMessage
    };
}

export default {
    sendEmail
};
