
// Fetch request
import fetch from '../core/fetch';
import { getShortPushNotification } from './getShortPushNotification';

export async function sendNotifications(content, userId) {

    let message = content.message;
    const trimContent = await getShortPushNotification(message);

    content['message'] = trimContent

    const resp = await fetch('/push-notification', {
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
