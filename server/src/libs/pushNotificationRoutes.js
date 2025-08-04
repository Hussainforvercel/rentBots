import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import  {getMessaging}  from "firebase-admin/messaging";
import UserLogin  from '../data/models/UserLogin.js';
import  {getConfigurationData}  from './getConfigurationData.js';
import {tokenSplitup} from '../helpers/notificationSplitup.js';

const pushNotificationRoutes = app => {

    app.post('/push-notification', async function (req, res) {
        try {
            const configData = await getConfigurationData({ name: ['fcmPushNotificationKey'] });

            let { userId, content } = req.body;
            const notificationId = Math.floor(100000 + Math.random() * 900000);
            content['notificationId'] = notificationId;
            content['content_available'] = true;

            // Retrieve device IDs for the user
            const getdeviceIds = await UserLogin.findAll({
                attributes: ['deviceId', 'deviceType'],
                where: { userId },
                raw: true
            });

            // Check for devices and collect device IDs
            const deviceIds = getdeviceIds.map(o => o.deviceId).filter(id => id);

            if (deviceIds.length === 0) {
                return res.status(400).send({ status: 400, errorMessage: 'No devices found for this user' });
            }

            // Initialize Firebase app if not already initialized
            if (!getApps().length) {
                initializeApp({ credential: cert(JSON.parse(configData.fcmPushNotificationKey)) });
            } else {
                getApp();
            }

            // Split device IDs into tokens for messaging
            const getTokens = await tokenSplitup(deviceIds);

            if (getTokens.length === 0) {
                return res.status(400).send({ status: 400, errorMessage: 'No valid tokens' });
            }

            // Send notifications to each token
            const sendPromises = getTokens.map(async (tokens) => {
                const message = {
                    notification: {
                        title: content.title,
                        body: content.message
                    },
                    data: {
                        content: JSON.stringify(content),
                    },
                    tokens
                };

                try {
                    const response = await getMessaging().sendEachForMulticast(message);
                    console.log('Successfully sent message:', response);
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            });

            await Promise.all(sendPromises);

            return res.status(200).send({ status: 200, errorMessage: null });

        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(400).send({ status: 400, errorMessage: error.message || 'An error occurred' });
        }
    });
};

export default pushNotificationRoutes;
