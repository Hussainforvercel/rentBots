import fetch from 'node-fetch';
import { url } from '../config.js';
import { getShortPushNotification } from './getShortPushNotification.js';

export async function sendNotifications(content, userId) {

    let message = content.message;
    const trimContent = await getShortPushNotification(message);

    content['message'] = trimContent

    const resp = await fetch(url + '/push-notification', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content,
            userId
        }),
        credentials: 'include'
    });

    const { status, errorMessage } = resp.json;

    return await {
        status,
        errorMessage
    };

}

export default {
    sendNotifications
}
