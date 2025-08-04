
export const getShortPushNotification = (message) => {
    let count = 150, trimContent = message;
    if (message && message.length > 150) {
        trimContent = message.slice(0, count);
        trimContent = trimContent.concat('...');
    }
    return trimContent;
}