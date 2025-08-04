import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import bcrypt from 'bcrypt';
// import { User, UserLogin, UserProfile } from '../../models';
import User from '../../models/User.js';
import UserLogin from '../../models/UserLogin.js';
import UserProfile from '../../models/UserProfile.js';
import UserCommonType from '../../types/UserCommonType.js';
import { createJWToken } from '../../../libs/auth.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userLogin = {
    type: UserCommonType,
    args: {
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
        deviceType: { type: new NonNull(StringType) },
        deviceDetail: { type: StringType },
        deviceId: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, {
        email,
        password,
        deviceType,
        deviceDetail,
        deviceId
    }) {

        console.log('User Login Data:', { email, password, deviceType, deviceDetail, deviceId });

        try {
            if (!request.user) {
                // Check if the user is already exists
                const checkUser = await User.findOne({
                    attributes: ['id', 'email', 'password', 'userBanStatus'],
                    where: {
                        email,
                        userDeletedAt: {
                            $eq: null
                        },
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                });

                if (checkUser) {
                    // Validate Password
                    if (bcrypt.compareSync(password, checkUser.password)) {
                        // Validate Is user banned
                        if (checkUser.userBanStatus == 1) {
                            return {
                                errorMessage: await showErrorMessage({ errorCode: 'userBan' }),
                                status: 500
                            };
                        } else {
                            let userToken, where, deviceLoginExist;
                            userToken = await createJWToken(checkUser.id, checkUser.email);
                            where = {
                                userId: checkUser.id,
                                deviceId,
                                deviceType
                            };

                            deviceLoginExist = await UserLogin.findOne({
                                where
                            });

                            if (deviceLoginExist) {
                                // update login token record with device infomation
                                const updateUserLogin = await UserLogin.update({
                                    key: userToken,
                                    userId: checkUser.id,
                                    deviceType,
                                    deviceDetail,
                                    deviceId
                                }, {
                                    where
                                });
                            } else {
                                // Insert login token record with device infomation
                                const creatUserLogin = await UserLogin.create({
                                    key: userToken,
                                    userId: checkUser.id,
                                    deviceType,
                                    deviceDetail,
                                    deviceId
                                });
                            }

                            let user = await UserProfile.findOne({
                                where: {
                                    userId: checkUser.id,
                                },
                                raw: true
                            });

                            return {
                                result: {
                                    email: checkUser.email,
                                    userId: checkUser.id,
                                    userToken,
                                    user
                                },
                                status: 200,
                            };
                        }
                    } else {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'incorrectPassword' }),
                            status: 400
                        };
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'emailNotExist' }),
                        status: 400
                    };
                }
            } else {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'alreadyLoggedIn' }),
                    status: 400
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};

export default userLogin;