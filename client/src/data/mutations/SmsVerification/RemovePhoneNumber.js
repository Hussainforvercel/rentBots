import { UserProfile, UserVerifiedInfo } from '../../models';
import UserAccountType from '../../types/userAccountType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const RemovePhoneNumber = {
    type: UserAccountType,
    args: {
    },
    async resolve({ request }) {

        try {
            // Check whether user is logged in
            if (request?.user) {
                let published;

                const isValidUser = await UserProfile.count({
                    where: {
                        userId: request?.user?.id,
                    }
                });

                if (isValidUser) {
                    const publish = await UserProfile.update({
                        countryCode: null,
                        phoneNumber: null,
                        countryName: null,
                        verificationCode: null
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

                    const updatePhoneVerified = await UserVerifiedInfo.update({
                        isPhoneVerified: false
                    }, {
                        where: {
                            userId: request?.user?.id
                        }
                    });

                    return {
                        status: published ? '200' : '400'
                    };
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

export default RemovePhoneNumber;