import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// import { EmailToken, User, UserLogin, UserVerifiedInfo } from '../../../data/models';
import EmailToken from '../../models/EmailToken.js'
import User from '../../models/User.js';
import UserLogin from '../../models/UserLogin.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js';
import getEmailTokenType from '../../types/getEmailTokenType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const EmailVerification = {
    type: getEmailTokenType,
    args: {
        token: { type: new NonNull(StringType) },
        email: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, { token, email }) {

        let where, currentToken, status = 200, errorMessage;
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                currentToken = request.headers.auth;
                where = {
                    userId: request.user.id,
                    key: currentToken
                };

                // Check if the user is already exists
                const checkUser = await User.findOne({
                    attributes: ['id', 'email', 'type', 'userBanStatus'],
                    where: {
                        email,
                        userDeletedAt: {
                            $eq: null
                        },
                        id: request.user.id
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                    raw: true
                });

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin && checkUser) {
                    const userId = request.user.id;
                    if (checkUser.userBanStatus == 1) {
                        return {
                            errorMessage: await showErrorMessage({errorCode: 'userBan' }),
                            status: 500
                        };
                    } else {
                        const checkEmailConfirmation = await EmailToken.count({
                            where: {
                                email,
                                token,
                                userId: request.user.id
                            }
                        });

                        if (checkEmailConfirmation > 0) {
                            const updateVerifiedTable = await UserVerifiedInfo.update({
                                isEmailConfirmed: true
                            },
                                {
                                    where: {
                                        userId: request.user.id
                                    }
                                });
                            if (updateVerifiedTable) {
                                return {
                                    status: 200
                                }
                            }
                        } else {
                            if (request.user.email !== email) {
                                return {
                                    status: 400,
                                    errorMessage:await showErrorMessage({ errorCode: 'invalidEmail' })
                                }
                            } else {
                                return {
                                    status: 400,
                                    errorMessage: await showErrorMessage({errorCode: 'invalidToken' })
                                }
                            }
                        }
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({errorCode: 'userLoginError' }),
                        status: 500
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({errorCode: 'userLoginError' }),
                    status: 500
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default EmailVerification;