import SiteSettings from '../../models/siteAdmin/SiteSettings.js'
import GetPaymentKeyType from '../../types/siteadmin/GetPaymentKeyType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getPaymentSettings = {
    type: GetPaymentKeyType,
    async resolve({ request }) {

        try {
            if (request && request.user) {
                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }
            }

            const result = await SiteSettings.findOne({
                attributes: ['id', 'value'],
                where: {
                    name: 'stripePublishableKey'
                }
            });

            return await {
                status: result ? 200 : 400,
                errorMessage: result ? null : await showErrorMessage({ errorCode: 'unableToFind' }),
                result: {
                    publishableKey: result.value
                }
            };
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })

            }
        }
    }
};

export default getPaymentSettings;
