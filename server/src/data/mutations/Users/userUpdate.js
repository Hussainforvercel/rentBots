import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// import { UserLogin, UserProfile, User, AdminUser } from '../../models';
import UserLogin from '../../queries/Users/userLogin.js';
import UserProfile from '../../models/UserProfile.js';
import User from '../../models/User.js';
import AdminUser from '../../models/siteAdmin/AdminUser.js';
import UserType from '../../types/UserType.js';
import  createJWToken  from '../../../libs/auth.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userUpdate = {
    type: UserType,
    args: {
        userId: { type: new NonNull(StringType) },
        fieldName: { type: new NonNull(StringType) },
        fieldValue: { type: StringType },
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, {
        userId,
        fieldName,
        fieldValue,
        deviceType,
        deviceId
    }) {
        let where, status = 200, errorMessage, convertedName, displayName, userToken, currentToken;

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
                    userId,
                    deviceType,
                    deviceId,
                    key: currentToken
                };

                const checkLogin = await UserLogin.findOne({
                    attributes: ['id'],
                    where
                });

                if (checkLogin && request.user.id === userId) {
                    if (fieldName === 'email') { // If email field
                        if (request.user.email !== fieldValue) { // If new email
                            // Find If already have same
                            const getUserExist = await User.findOne({
                                attributes: ['id'],
                                where: {
                                    email: fieldValue,
                                    $not: {
                                        id: userId
                                    },
                                    userDeletedAt: {
                                        $eq: null
                                    },
                                }
                            });

                            if (getUserExist) {
                                status = 400;
                                errorMessage = await showErrorMessage({ errorCode: 'checkEmail' })
                            } else {
                                const getAdminExist = await AdminUser.findOne({
                                    attributes: ['id'],
                                    where: { email: fieldValue }
                                });

                                if (getAdminExist) {
                                    status = 400;
                                    errorMessage = await showErrorMessage({ errorCode: 'checkEmail' })
                                } else {
                                    const userEmailUpdate = await User.update({
                                        email: fieldValue
                                    }, {
                                        where: {
                                            id: userId
                                        }
                                    });

                                    // New Token
                                    userToken = await createJWToken(userId, fieldValue);

                                    await UserLogin.update({
                                        key: userToken
                                    }, {
                                        where
                                    });
                                }
                            }
                        }
                    } else if (fieldName === 'firstName') { // If first & last name fields
                        convertedName = JSON.parse(fieldValue);
                        if (convertedName && convertedName.length === 2) {
                            displayName = convertedName[0] + ' ' + convertedName[1];

                            const updateName = await UserProfile.update(
                                {
                                    firstName: convertedName[0],
                                    lastName: convertedName[1],
                                    displayName
                                },
                                {
                                    where: {
                                        userId: request.user.id
                                    }
                                }
                            );

                            status = updateName ? 200 : 400;
                            errorMessage = updateName ? null : await showErrorMessage({ errorCode: 'updateValues' });
                        } else {
                            status = 400;
                            errorMessage = await showErrorMessage({ errorCode: 'requiredError' })
                        }
                    } else { // Other fields
                        const updateUser = await UserProfile.update(
                            {
                                [fieldName]: fieldValue
                            },
                            {
                                where: {
                                    userId: request.user.id
                                }
                            }
                        );

                        status = updateUser ? 200 : 400;
                        errorMessage = updateUser ? null : await showErrorMessage({ errorCode: 'updateUser', error: fieldName });
                    }

                    return await {
                        status,
                        errorMessage,
                        userToken
                    };
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' }),
                        status: 500,
                        userToken
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userLoginError' }),
                    status: 500,
                    userToken
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400,
                userToken
            }
        }
    }
};

export default userUpdate;
