import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import User from '../../models/User.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js';
import AdminUser from '../../models/siteAdmin/AdminUser.js';
import UserProfile from '../../models/UserProfile.js';
import EmailToken from '../../models/EmailToken.js';
import UserLogin from '../../models/UserLogin.js';
// import { AdminUser, User, UserVerifiedInfo, UserProfile, EmailToken, UserLogin } from '../../models/index.js';
import UserCommonType from '../../types/UserCommonType.js';
import { capitalizeFirstLetter } from '../../../helpers/capitalizeFirstLetter.js';
import { createJWToken } from '../../../libs/auth.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const createUser = {
    type: UserCommonType,
    args: {
        firstName: { type: StringType },
        lastName: { type: StringType },
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
        dateOfBirth: { type: StringType },
        deviceType: { type: new NonNull(StringType) },
        deviceDetail: { type: StringType },
        deviceId: { type: new NonNull(StringType) },
        registerType: { type: StringType }
    },
    async resolve({ request, response }, {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        deviceType,
        deviceDetail,
        deviceId,
        registerType
    }) {
        console.log('Received data:', {
            firstName,
            lastName,
            email,
            password,
            dateOfBirth,
            deviceType,
            deviceDetail,
            deviceId,
            registerType
        });
        let sigupType = (registerType) ? registerType : 'email';
        let updatedFirstName = capitalizeFirstLetter(firstName);
        let updatedLastName = capitalizeFirstLetter(lastName);
        let displayName = updatedFirstName + ' ' + updatedLastName;

        const checkUser = await User.findOne({
            attributes: ['id', 'email'],
            where: {
                email,
                userDeletedAt: {
                    $eq: null
                },
            },
        });

        try {
            if (checkUser) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'userExists' }),
                    status: 400
                };
            } else {
                const getAdminUserId = await AdminUser.findOne({
                    where: {
                        email
                    },
                });

                if (getAdminUserId) {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'userExists' }),
                        status: 400
                    };
                } else {
                    // New User Creation
                    const newUser = await User.create({
                        email,
                        emailConfirmed: true,
                        password: User.prototype.generateHash(password),
                        type: sigupType,
                        profile: {
                            firstName,
                            lastName,
                            displayName,
                            dateOfBirth
                        },
                        userVerifiedInfo: {
                            isEmailConfirmed: false
                        },
                        emailToken: {
                            email,
                            token: Date.now()
                        }
                    }, {
                        include: [
                            { model: UserProfile, as: 'profile' },
                            { model: UserVerifiedInfo, as: 'userVerifiedInfo' },
                            { model: EmailToken, as: 'emailToken' }
                        ]
                    });

                    if (newUser) {
                        let userToken = await createJWToken(newUser.id, newUser.email);

                        // Insert login token record with device infomation
                        await UserLogin.create({
                            key: userToken,
                            userId: newUser.id,
                            deviceType,
                            deviceDetail,
                            deviceId
                        });

                        const getEmailToken = await EmailToken.findOne({
                            attributes: ['token'],
                            where: { userId: newUser.id }
                        });

                        let content = {
                            token: getEmailToken.dataValues.token,
                            name: firstName,
                            email: newUser.email
                        };

                        let user = await UserProfile.findOne({
                            where: {
                                userId: newUser.id,
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
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    }
};

export default createUser;