import {
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
} from 'graphql';
import twilio from 'twilio';
import moment from 'moment';
// import { UserProfile, UserVerifiedInfo } from '../../models';
import UserProfile from '../../models/UserProfile.js';
import UserVerifiedInfo from '../../models/UserVerifiedInfo.js'
import UserAccountType from '../../types/userAccountType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { getConfigurationData } from '../../../libs/getConfigurationData.js'
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const AddPhoneNumber = {
    type: UserAccountType,
    args: {
        countryCode: { type: new NonNull(StringType) },
        phoneNumber: { type: new NonNull(StringType) },
    },
    async resolve({ request }, {
        countryCode,
        phoneNumber
    }) {

        try {

            if (!request.user || !request.user.id) {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'loginError' })
                };
            }

            const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
            if (userStatusErrorMessage) {
                return {
                    status: userStatusError,
                    errorMessage: userStatusErrorMessage
                };
            }

            let siteName, phoneNumberStatus, verificationCode = Math.floor(1000 + Math.random() * 9000), sendSms = true;
            let userId = request.user.id, status = false, today = moment();
            let codeUpdatedAt, userProfileNumber, timeDiff, client;
            let message, convertedNumber;

            const siteData = await getConfigurationData({ name: ['siteName', 'phoneNumberStatus'] });

            siteName = siteData.siteName;
            phoneNumberStatus = siteData.phoneNumberStatus;

            if (phoneNumberStatus == '1') {

                const twillioData = await getConfigurationData({ name: ['twillioAccountSid', 'twillioAuthToken', 'twillioPhone'] });

                try {
                    client = new twilio(twillioData.twillioAccountSid, twillioData.twillioAuthToken);
                } catch (error) {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'twilioAuthError' })
                    }
                }

                message = siteName + ' security code: ' + verificationCode;
                message += '. Use this to finish your verification.';
                convertedNumber = countryCode + phoneNumber;

                await UserVerifiedInfo.update({
                    isPhoneVerified: false
                },
                    {
                        where: {
                            userId
                        }
                    }
                );

                const findUpdatedTime = await UserProfile.findOne({
                    attributes: ['codeUpdatedAt', 'phoneNumber', 'countryCode'],
                    where: {
                        userId
                    },
                    raw: true
                });


                if (findUpdatedTime && findUpdatedTime.codeUpdatedAt) {
                    codeUpdatedAt = moment(findUpdatedTime.codeUpdatedAt);
                    userProfileNumber = findUpdatedTime.countryCode + findUpdatedTime.phoneNumber;
                    timeDiff = today.diff(codeUpdatedAt, 'minutes');

                    if (timeDiff < 2 && userProfileNumber == convertedNumber) {
                        sendSms = false;
                    }
                }

                if (sendSms) {
                    await UserProfile.update({
                        countryCode,
                        phoneNumber,
                        verificationCode,
                        codeUpdatedAt: new Date()
                    }, {
                        where: {
                            userId
                        }
                    });

                    let responseData = await client.messages
                        .create({
                            body: message,
                            from: twillioData.twillioPhone,
                            to: convertedNumber
                        });

                    status = true;
                } else {
                    return {
                        status: 400,
                        errorMessage: await showErrorMessage({ errorCode: 'newOtp' })
                    }
                }
            } else {
                await UserVerifiedInfo.update({
                    isPhoneVerified: true
                },
                    {
                        where: {
                            userId
                        }
                    }
                );

                await UserProfile.update({
                    countryCode,
                    phoneNumber
                }, {
                    where: {
                        userId
                    }
                });

                status = true;
            }

            if (status) {
                return {
                    status: 200,
                    countryCode,
                    phoneNumber,
                    phoneNumberStatus
                };
            } else {
                return {
                    status: 400,
                    errorMessage: await showErrorMessage({ errorCode: 'invalidError' })
                }
            }

        } catch (error) {
            return {
                status: 400,
                errorMessage: error.message == 'Authenticate' ? await showErrorMessage({ errorCode: 'twilioAuthError' }) : error.message
            }
        }
    },
};

export default AddPhoneNumber;
