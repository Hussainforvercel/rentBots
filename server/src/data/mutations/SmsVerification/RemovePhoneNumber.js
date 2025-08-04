import UserProfile from '../../models/UserProfile.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js'
import UserAccountType from '../../types/userAccountType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const RemovePhoneNumber = {
    type: UserAccountType,
    async resolve({ request }) {

        // Check whether user is logged in
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let published, errorMessage;

                const isValidUser = await UserProfile.count({
                    where: {
                        userId: request.user.id,
                    }
                });

                if (isValidUser) {
                    await UserProfile.update({
                        countryCode: null,
                        phoneNumber: null,
                        verificationCode: null
                    }, {
                        where: {
                            userId: request.user.id
                        }
                    }).spread(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            published = true;
                        }
                    });

                    await UserVerifiedInfo.update({
                        isPhoneVerified: false
                    }, {
                        where: {
                            userId: request.user.id
                        }
                    });

                    return {
                        status: published ? 200 : 400,
                        errorMessage: published ? null : await showErrorMessage({ errorCode: 'invalidError' })
                    }
                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                    }
                }
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default RemovePhoneNumber;
