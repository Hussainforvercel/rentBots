import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
// import { ForgotPassword, User } from '../../models';
import ForgotPassword from '../../models/ForgotPassword.js';
import User from '../../models/User.js';
import UserType from '../../types/UserType.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const updateForgotPassword = {
    type: UserType,
    args: {
        email: { type: new NonNull(StringType) },
        password: { type: new NonNull(StringType) },
        token: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, { email, password, token }) {
        let userId;

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

                    const getForgotPassword = await ForgotPassword.findOne({
                        attributes: ['id'],
                        where: {
                            email,
                            token
                        }
                    });

                    if (getForgotPassword) {
                        const passwordUpdate = await User.update({
                            password: User.prototype.generateHash(password)
                        }, {
                            where: {
                                id: userId
                            }
                        });

                        const deleteOldToken = await ForgotPassword.destroy({
                            where: {
                                email
                            }
                        });

                        return {
                            status: passwordUpdate ? 200 : 400,
                            errorMessage: passwordUpdate ? null : await showErrorMessage({ errorCode: 'updateUserPassword' }),
                        }
                    } else {
                        return {
                            status: 500,
                            errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' })
                        };
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

export default updateForgotPassword;