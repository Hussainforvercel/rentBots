import {
    GraphQLList as List,
    GraphQLString as StringType
} from 'graphql';
import stripePackage from 'stripe';
import { Payout, PaymentMethods } from '../../models';
import PayoutType from '../../types/PayoutType';
import showErrorMessage from '../../../helpers/showErrorMessage';
import { payment } from '../../../config-sample';
const stripe = stripePackage(payment.stripe.secretKey, {
    apiVersion: '2019-12-03'
});

const getPayouts = {

    type: new List(PayoutType),

    args: {
        currentAccountId: {
            type: StringType
        },
        userId: {
            type: StringType
        }
    },

    async resolve({ request }, { currentAccountId, userId }) {
        try {
            if (request?.user && !request?.user?.admin) {
                const userId = request?.user?.id;
                const payEmail = currentAccountId;
                let isVerified = true, accountInfo = null, methodArray = [], accountUserId;

                if (payEmail && payEmail.toString().trim() != '') {
                    const stripeAccount = await stripe.accounts.retrieve(payEmail);
                    accountUserId = stripeAccount?.metadata && stripeAccount?.metadata?.userId;
                    if (userId === accountUserId) {
                        if (stripeAccount) {
                            accountInfo = stripeAccount && (stripeAccount?.individual || stripeAccount?.company);
                            if (!stripeAccount?.details_submitted) {
                                isVerified = false;
                            }

                            if (stripeAccount?.requirements && stripeAccount?.requirements?.disabled_reason) {
                                isVerified = false;
                            }

                            const isAccountExist = await Payout.findOne({
                                attributes: ['id'],
                                where: {
                                    payEmail,
                                    userId
                                },
                                raw: true
                            });

                            if (isAccountExist?.id) { // Update verification status to the existing Connect account
                                await Payout.update({
                                    isVerified
                                }, {
                                    where: {
                                        id: isAccountExist?.id
                                    }
                                });
                            } else { // Create a new account
                                await Payout.create({
                                    methodId: 2,
                                    userId,
                                    payEmail,
                                    address1: accountInfo?.address?.line1,
                                    address2: accountInfo?.address?.line2,
                                    city: accountInfo?.address?.city,
                                    state: accountInfo?.address?.state,
                                    country: accountInfo?.address?.country,
                                    zipcode: accountInfo?.address?.postal_code,
                                    currency: stripeAccount?.default_currency?.toUpperCase(),
                                    default: false,
                                    last4Digits: stripeAccount?.external_accounts?.data[0]?.last4,
                                    isVerified
                                });
                            }

                            // Set Default
                            const isDefaultExist = await Payout.count({
                                where: {
                                    default: true,
                                    userId
                                }
                            });

                            if (isDefaultExist <= 0 && isVerified) {
                                await Payout.update({
                                    default: true
                                }, {
                                    where: {
                                        payEmail,
                                        userId
                                    }
                                });
                            };
                        };
                    } else {
                        return {
                            status: 400,
                            errorMessage: await showErrorMessage({ errorCode: 'checkUserExist' })
                        };
                    };
                }

                const getPaymentMethods = await PaymentMethods.findAll({
                    attributes: ['id'],
                    where: {
                        isEnable: 1
                    },
                    raw: true
                });

                getPaymentMethods.map((item) => {
                    methodArray.push(item.id)
                })

                return await Payout.findAll({
                    where: {
                        userId,
                    },
                    order: [
                        ['default', 'DESC']
                    ]
                });

            } else {
                return {
                    status: "notLoggedIn",
                };
            }

        } catch (error) {
            return {
                status: '500',
                errorMessage: await showErrorMessage({ errorCode: 'catchError', error })
            };
        }
    }
};

export default getPayouts;