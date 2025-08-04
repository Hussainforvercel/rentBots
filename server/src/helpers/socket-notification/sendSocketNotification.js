import fetch from 'node-fetch';
import { websiteUrl } from '../../config';

export async function sendSocketNotification(endPoint, content) {

    const response = await fetch(websiteUrl + '/socketNotification', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            endPoint,
            content
        }),
        credential: 'include'
    });

    const { status, errorMessage } = await response.json();
    return await { status, errorMessage };
}

export default sendSocketNotification;