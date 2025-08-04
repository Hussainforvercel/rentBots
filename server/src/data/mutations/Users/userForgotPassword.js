import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import ForgotPassword from '../../models/ForgotPassword.js';
import User from '../../models/User.js';
import UserProfile from '../../models/UserProfile.js';
import UserType from '../../types/UserType.js';
import sendEmail  from '../../../libs/sendEmail.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const userForgotPassword = {
    type: UserType,
    args: {
        email: { type: new NonNull(StringType) }
    },
    async resolve({ request, response }, { email }) {
        let userId, content, token = Date.now(), forgotLink;

        try {
            if (request.user) {
                return {
                    errorMessage: await showErrorMessage({ errorCode: 'currentlyUserLogin' }),
                    status: 400
                };
            } else {
                const getUser = await User.findOne({
                    where: {
                        email,
                        userDeletedAt: null
                    },
                    raw: true
                });

                if (getUser) {
                    userId = getUser.id;
                    const userProfileData = await UserProfile.findOne({
                        attributes: ['firstName'],
                        where: {
                            userId
                        },
                        raw: true
                    })
                    await ForgotPassword.destroy({
                        where: {
                            email,
                            userId
                        }
                    });
                    const createNewToken = await ForgotPassword.create({
                        email,
                        userId,
                        token
                    });
                    if (createNewToken) {
                        content = {
                            token,
                            email,
                            name: userProfileData.firstName
                        };

                        forgotLink = '/password/verification?token=' + token + '&email=' + email;
                        const { status, errorMessage } = await sendEmail(email, 'forgotPasswordLink', content);

                        return {
                            status: 200,
                            forgotLink
                        }
                    } else {
                        return {
                            errorMessage: await showErrorMessage({ errorCode: 'forgotPasswordLink' }),
                            status: 400
                        }
                    }
                } else {
                    return {
                        errorMessage: await showErrorMessage({ errorCode: 'invalidEmailAddress', error: email }),
                        status: 400
                    };
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

export default userForgotPassword;