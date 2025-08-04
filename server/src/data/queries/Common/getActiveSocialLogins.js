import socialLoginsType from '../../types/socialLoginsType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const getActiveSocialLogins = {
    type: socialLoginsType,
    async resolve({ request, response }) {

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

            return {
                status: 200,
                results: {
                    facebook: false,
                    google: false
                }
            };
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};

export default getActiveSocialLogins;