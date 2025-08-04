import {
    GraphQLString as StringType,
} from 'graphql';
import stripePackage from 'stripe';
import GetPayoutType from '../../types/GetPayoutType.js';
import { payment, url } from '../../../config.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const stripe = stripePackage(payment.stripe.secretKey, {
    apiVersion: '2019-12-03'
});

const verifyPayout = {
    type: GetPayoutType,
    args: {
        stripeAccount: { type: StringType }
    },
    async resolve({ request }, { stripeAccount }) {

        try {
            if (request.user) {

                const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
                if (userStatusErrorMessage) {
                    return {
                        status: userStatusError,
                        errorMessage: userStatusErrorMessage
                    };
                }

                let stripeAccountId = stripeAccount ? stripeAccount : null, status = 200, connectUrl;
                let successUrl = url + '/user/payout/success?account=' + stripeAccountId;
                let failureUrl = url + '/user/payout/failure?account=' + stripeAccountId;

                if (stripeAccountId != null) {
                    const accountLinks = await stripe.accountLinks.create({
                        account: stripeAccountId,
                        failure_url: failureUrl,
                        success_url: successUrl,
                        type: 'custom_account_verification',
                        collect: 'currently_due', // currently_due or eventually_due
                    });

                    connectUrl = accountLinks.url; // Account links API on-boarding URL

                    return await {
                        status,
                        connectUrl,
                        successUrl,
                        failureUrl,
                        stripeAccountId
                    }
                }

            } else {
                return {
                    status: 500,
                    errorMessage: await showErrorMessage({ errorCode: 'userAuthenticate' })
                };
            }
        } catch (err) {
            return {
                status: 400,
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error: err.message })
            }
        }
    }
}

export default verifyPayout