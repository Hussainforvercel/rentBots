import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import { UserProfile } from '../../models';
import UserAccountType from '../../types/userAccountType';
import showErrorMessage from '../../../helpers/showErrorMessage';

const AddPhoneNumber = {
    type: UserAccountType,
    args: {
        countryCode: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
    },
    async resolve({ request }, { countryCode, phoneNumber }) {

        try {
            // Check whether user is logged in
            if (request?.user) {
                let published, userProfileNumber;

                const existingProfile = await UserProfile.findOne({
                    attributes: ['phoneNumber', 'countryCode'],
                    where: {
                        userId: request?.user?.id
                    }
                });

                userProfileNumber = existingProfile ? existingProfile?.countryCode + existingProfile?.phoneNumber : null;

                const publish = await UserProfile.update({
                    countryCode,
                    phoneNumber
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

                if (published) {
                    return {
                        status: '200',
                        countryCode,
                        phoneNumber,
                        userProfileNumber
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

export default AddPhoneNumber;
