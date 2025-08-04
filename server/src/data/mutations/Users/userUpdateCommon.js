import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import UserLogin from '../../models/UserLogin.js';
import UserProfile from '../../models/UserProfile.js';
import UserType from '../../types/UserType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userUpdateCommon = {
    type: UserType,
    args: {
        userId: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
        deviceId: { type: new NonNull(StringType) },
        firstName: { type: StringType },
        lastName: { type: StringType },
        gender: { type: StringType },
        location: { type: StringType },
        dateOfBirth: { type: StringType },
    },
    async resolve({ request, response }, {
        userId,
        deviceType,
        deviceId,
        firstName,
        lastName,
        gender,
        location,
        dateOfBirth

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
                    displayName = firstName + ' ' + lastName;

                    const updateProfile = await UserProfile.update(
                        {
                            firstName: firstName,
                            lastName: lastName,
                            displayName: displayName,
                            gender: gender,
                            location: location,
                            dateOfBirth: dateOfBirth

                        },
                        {
                            where: {
                                userId: request.user.id
                            }
                        }
                    );

                    return {
                        status: updateProfile ? 200 : 400,
                        errorMessage: updateProfile ? null : await showErrorMessage({ errorCode: 'updateError' })
                    }
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

export default userUpdateCommon;

