import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { ForgotPassword } from '../../models';
import ForgotPasswordType from '../../types/EmailTokenType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const forgotPasswordVerification = {

    type: ForgotPasswordType,

    args: {
        token: { type: new NonNull(StringType) },
        email: { type: new NonNull(StringType) },
    },

    async resolve({ request, response }, { token, email }) {
        try {
            if (!request?.user) {
                const checkForgotPassword = await ForgotPassword.findOne({
                    where: {
                        email,
                        token
                    }
                });

                return {
                    status: checkForgotPassword ? '200' : '400'
                };

            } else {
                return {
                    status: '400'
                };
            }
        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    },
};

export default forgotPasswordVerification;