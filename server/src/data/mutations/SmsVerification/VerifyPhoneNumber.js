import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import UserProfile from '../../models/UserProfile.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js'
import UserAccountType from '../../types/userAccountType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const VerifyPhoneNumber = {
    type: UserAccountType,
    args: {
        verificationCode: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { verificationCode }) {

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

                const isValidCode = await UserProfile.count({
                    where: {
                        userId: request.user.id,
                        verificationCode
                    }
                });

                if (isValidCode) {

                    await UserVerifiedInfo.update({
                        isPhoneVerified: true
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

                    return {
                        status: published ? 200 : 400,
                        errorMessage: published ? null : await showErrorMessage({ errorCode: 'invalidError' })
                    };
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
                }
            }
        } catch (error) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            }
        }
    },
};

export default VerifyPhoneNumber;
