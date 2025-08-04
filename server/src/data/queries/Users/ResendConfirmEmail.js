// import { EmailToken, UserProfile, User, UserLogin } from '../../models';
import EmailToken from '../../models/EmailToken.js';
import UserProfile from '../../models/UserProfile.js';
import User from '../../models/User.js';
import UserLogin from '../../models/UserLogin.js';
import getEmailTokenType from '../../types/getEmailTokenType.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js'

const ResendConfirmEmail = {
    type: getEmailTokenType,
    async resolve({ request, response }) {

        let where, status = 200, errorMessage;
        let currentToken;
        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                const userId = request.user.id;
                const email = request.user.email;
                let token = Date.now();

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
                        id: request.user.id,
                        userDeletedAt: {
                            $eq: null
                        },
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
                    if (checkUser.userBanStatus == 1) {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'userBan' }),
                            status: 500
                        };
                    } else {
                        const checkEmailToken = await EmailToken.findOne({
                            where: {
                                userId,
                                email,
                            },
                        });

                        let user = await UserProfile.findOne({
                            where: {
                                userId: request.user.id,
                            },
                            raw: true
                        });

                        if (checkEmailToken) {
                            let content = {
                                token: checkEmailToken.token,
                                email,
                                name: user.firstName
                            };

                            const { status, errorMessage } = await sendEmail(email, 'confirmEmail', content);

                            return {
                                results: checkEmailToken,
                                status: 200,
                            }
                        } else {
                            const createEmailToken = await EmailToken.create({
                                userId,
                                email,
                                token
                            });

                            let user = await UserProfile.findOne({
                                where: {
                                    userId: request.user.id,
                                },
                                raw: true
                            });
                            if (createEmailToken) {
                                let content = {
                                    token,
                                    email,
                                    name: user.firstName
                                };

                                const { status, errorMessage } = await sendEmail(email, 'confirmEmail', content);

                                return {
                                    results: {
                                        userId,
                                        email,
                                        token,
                                    },
                                    status: 200,
                                }
                            } else {
                                return {
                                    errorMessage: await showErrorMessage({ errorCode: 'invalidEmail' }),
                                    status: 400
                                }
                            }
                        }
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'userLoginError' }),
                        status: 500
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' }),
                    status: 500
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default ResendConfirmEmail;