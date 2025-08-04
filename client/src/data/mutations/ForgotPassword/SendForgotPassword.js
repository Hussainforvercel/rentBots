import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull
} from 'graphql';
import { ForgotPassword, User } from '../../models';
import ForgotPasswordType from '../../types/EmailTokenType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const sendForgotPassword = {
    type: ForgotPasswordType,
    args: {
        email: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, { email }) {

        try {
            if (request?.user?.admin) {
                return {
                    status: '404',
                    errorMessage: await showErrorMessage({ errorCode: 'adminUserLogged' })
                };
            }

            if (!request?.user) {
                let userId, token = Date.now();
                const getUser = await User.findOne({
                    where: {
                        email
                    }
                });

                if (getUser) {
                    userId = getUser?.id;
                    await ForgotPassword.destroy({
                        where: {
                            email,
                            userId
                        }
                    });
                    return await ForgotPassword.create({
                        email,
                        userId,
                        token
                    });
                } else {
                    return {
                        status: 'notAvailable'
                    };
                }

            } else {
                return {
                    status: '400'
                };
            }
        } catch (error) {
            return {
                status: '400',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default sendForgotPassword;