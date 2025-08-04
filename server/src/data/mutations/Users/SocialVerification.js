import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import  UserVerifiedInfo  from '../../models/UserVerifiedInfo.js';
import SocialVerificationType from '../../types/SocialVerificationType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const SocialVerification = {
    type: SocialVerificationType,
    args: {
        verificationType: { type: new NonNull(StringType) },
        actionType: { type: new NonNull(StringType) }
    },
    async resolve({ request }, {
        verificationType,
        actionType
    }) {

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let published;

                if (verificationType == 'google') {
                    await UserVerifiedInfo.update({
                        isGoogleConnected: actionType
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
                }

                if (verificationType == 'facebook') {
                    await UserVerifiedInfo.update({
                        isFacebookConnected: actionType
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
                }

                return {
                    status: published ? 200 : 400,
                    errorMessage: published ? null : await showErrorMessage({ errorCode: 'invalidError' })
                };
            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
            }
        }
    },
};

export default SocialVerification;
