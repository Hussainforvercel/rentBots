import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import ForgotPassword from '../../models/ForgotPassword.js';
import CommonType from '../../types/CommonType.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const verifyForgotPassword = {
    type: CommonType,
    args: {
        email: { type: new NonNull(StringType) },
        token: { type: new NonNull(StringType) },
    },
    async resolve({ request, response }, { email, token }) {
        try {
            if (request.user) {
                return {
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'currentlyUserLoggedIn' })
                };
            } else {
                const getForgotPassword = await ForgotPassword.findOne({
                    attributes: ['id'],
                    where: {
                        email,
                        token
                    }
                });

                return {
                    status: getForgotPassword ? 200 : 400,
                    errorMessage: getForgotPassword ? null : await showErrorMessage({ errorCode: 'invalidPasswordToken' })
                }
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            };
        }
    }
};

export default verifyForgotPassword;