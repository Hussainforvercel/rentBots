import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import User from '../../models/User.js';
import UserLogin from '../../models/UserLogin.js';
import UserProfile from '../../models/UserProfile.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js';
import EmailToken from '../../models/EmailToken.js';
import UserCommonType from '../../types/UserCommonType.js';
import { capitalizeFirstLetter } from '../../../helpers/capitalizeFirstLetter.js';
import { createJWToken } from '../../../libs/auth.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import { downloadFile } from '../../../libs/download.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userSocialLogin = {
    type: UserCommonType,
    args: {
        firstName: { type: StringType },
        lastName: { type: StringType },
        email: { type: new NonNull(StringType) },
        dateOfBirth: { type: StringType },
        deviceType: { type: new NonNull(StringType) },
        deviceDetail: { type: StringType },
        deviceId: { type: new NonNull(StringType) },
        registerType: { type: StringType },
        gender: { type: StringType },
        profilePicture: { type: StringType }
    },
    async resolve({ request, response }, {
        firstName,
        lastName,
        email,
        dateOfBirth,
        deviceType,
        deviceDetail,
        deviceId,
        registerType,
        gender,
        profilePicture
    }) {
        let signUpType, updatedFirstName, updatedLastName, displayName;
        let userToken, where, deviceLoginExist, userVerifiedType, random;
        let pictureData, picture = null, pictureURL;

        signUpType = (registerType) ? registerType : 'email';
        updatedFirstName = firstName ? capitalizeFirstLetter(firstName) : '';
        updatedLastName = lastName ? capitalizeFirstLetter(lastName) : '';
        displayName = updatedFirstName + ' ' + updatedLastName;
        userVerifiedType = registerType === 'google' ? 'isGoogleConnected' : 'isFacebookConnected';
        random = Date.now()

        try {
            if (!request.user) {
                // Check if the user is already exists
                const checkUser = await User.findOne({
                    attributes: ['id', 'email', 'type', 'userBanStatus'],
                    where: {
                        email,
                        userDeletedAt: {
                            $eq: null
                        },
                    },
                    order: [
                        [`createdAt`, `DESC`],
                    ],
                    raw: true
                });

                if (checkUser) { // Login                     
                    // Validate Is user banned
                    if (checkUser.userBanStatus == 1) {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'userBan' }),
                            status: 500
                        };
                    } else {
                        if (checkUser && checkUser.type === signUpType) {
                            userToken = await createJWToken(checkUser.id, checkUser.email);
                            where = {
                                userId: checkUser.id,
                                deviceId,
                                deviceType
                            };

                            await UserVerifiedInfo.update({
                                [userVerifiedType]: true
                            }, {
                                where: { userId: checkUser.id },
                            });

                            deviceLoginExist = await UserLogin.findOne({
                                where
                            });

                            if (deviceLoginExist) {
                                // update login token record with device infomation
                                await UserLogin.update({
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
                                await UserLogin.create({
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
                                    email: email,
                                    userId: checkUser.id,
                                    userToken
                                },
                                status: 200,
                                // user
                            };
                        } else {
                            return {
                                errorMessage: await showErrorMessage({ errorCode: 'checkUserType', error: checkUser.type }),
                                status: 400
                            };
                        }
                    }
                } else { // Sign up
                    // Downloading profile picture from social website
                    if (profilePicture) {
                        pictureURL = profilePicture;
                        pictureData = await downloadFile(profilePicture);
                        if (pictureData && pictureData.status === 200) {
                            picture = pictureData.filename;
                        }
                    }

                    const newUser = await User.create({
                        email,
                        emailConfirmed: true,
                        password: User.prototype.generateHash(random.toString()),
                        type: signUpType,
                        profile: {
                            displayName,
                            firstName: updatedFirstName,
                            lastName: updatedLastName,
                            dateOfBirth,
                            gender,
                            picture,
                        },
                        userVerifiedInfo: {
                            [userVerifiedType]: true
                        },
                        emailToken: {
                            token: random,
                            email
                        }
                    }, {
                        include: [
                            { model: UserProfile, as: 'profile' },
                            { model: UserVerifiedInfo, as: 'userVerifiedInfo' },
                            { model: EmailToken, as: 'emailToken' },
                        ],
                    });

                    if (newUser) {
                        const isUser = await User.findOne({
                            attributes: ['id', 'email', 'type', 'userBanStatus'],
                            where: {
                                email,
                                userDeletedAt: {
                                    $eq: null
                                },
                            },
                            order: [
                                [`createdAt`, `DESC`],
                            ],
                            raw: true
                        });

                        userToken = await createJWToken(newUser.id, newUser.email);

                        // Insert login token record with device infomation
                        await UserLogin.create({
                            key: userToken,
                            userId: newUser.id,
                            deviceType,
                            deviceDetail,
                            deviceId
                        });

                        let content = {
                            token: random,
                            name: firstName,
                            email: newUser.email
                        };

                        let user = await UserProfile.findOne({
                            where: {
                                userId: isUser.id,
                            },
                            raw: true
                        });

                        const { status, errorMessage } = await sendEmail(newUser.email, 'welcomeEmail', content);
                        return {
                            result: {
                                email: newUser.email,
                                userId: newUser.id,
                                userToken,
                                user
                            },
                            status: 200,
                        };
                    } else {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'invalidError' }),
                            status: 400
                        }
                    }
                    return {
                        status: 200
                    }
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

export default userSocialLogin;