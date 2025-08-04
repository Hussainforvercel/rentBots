import {
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { UserProfile, UserVerifiedInfo } from '../../models';
import UserAccountType from '../../types/userAccountType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const VerifyPhoneNumber = {
    type: UserAccountType,
    args: {
        verificationCode: { type: new NonNull(IntType) }
    },
    async resolve({ request }, { verificationCode }) {

        try {
            // Check whether user is logged in
            if (request?.user) {
                let published;

                const isValidCode = await UserProfile.count({
                    where: {
                        userId: request?.user?.id,
                        verificationCode
                    }
                });

                if (isValidCode) {

                    const updatePhoneVerified = await UserVerifiedInfo.update({
                        isPhoneVerified: true
                    }, {
                        where: {
                            userId: request?.user?.id
                        }
                    }).spread(function (instance) {
                        // Check if any rows are affected
                        if (instance > 0) {
                            published = true;
                        }
                    });

                    return {
                        status: published ? '200' : '400'
                    }
                } else {
                    return {
                        status: '400'
                    }
                }
            } else {
                return {
                    status: "notLoggedIn"
                };
            }
        } catch (error) {
            return {
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
                status: 400
            }
        }
    },
};

export default VerifyPhoneNumber;
