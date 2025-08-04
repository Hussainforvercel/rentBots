import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import stripePackage from 'stripe'
// import { Payout, PaymentMethods } from '../../models';
import Payout from '../../models/Payout.js';
import PaymentMethods from '../../models/PaymentMethods.js';
import GetPayoutType from '../../types/GetPayoutType.js';
import { isEuropeCountry } from '../../../helpers/europeCountryHelpers.js';
import { payment, url } from '../../../config.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const stripe = stripePackage(payment.stripe.secretKey, {
  apiVersion: '2019-12-03'
});

const addPayout = {
  type: GetPayoutType,
  args: {
    methodId: { type: IntType },
    payEmail: { type: StringType },
    address1: { type: StringType },
    address2: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    country: { type: StringType },
    zipcode: { type: StringType },
    currency: { type: StringType },
    firstname: { type: StringType },
    lastname: { type: StringType },
    accountNumber: { type: StringType },
    routingNumber: { type: StringType },
    businessType: { type: StringType },
    accountToken: { type: StringType },
    personToken: { type: StringType },
  },
  async resolve({ request }, {
    methodId,
    payEmail,
    address1,
    address2,
    city,
    state,
    country,
    zipcode,
    currency,
    firstname,
    lastname,
    accountNumber,
    routingNumber,
    businessType,
    accountToken,
    personToken
  }) {

    try {
      let userId = request.user.id, defaultvalue = false, status = 200, errorMessage,
        createPayout, connectUrl, stripeAccountId, business_type = null,
        requested_capabilities = ['card_payments', 'transfers'], external_account = {},
        createPersonToken, person;

      if (!request.user) {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'checkUserLogin' })
        };
      }

      const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
      if (userStatusErrorMessage) {
        return {
          status: userStatusError,
          errorMessage: userStatusErrorMessage
        };
      }

      if (methodId == 1) {
        let count = await Payout.count({
          where: {
            userId,
            default: true
          }
        });

        if (count <= 0) {
          defaultvalue = true;
        }

        const payout = await Payout.create({
          methodId,
          userId,
          payEmail,
          address1,
          address2,
          city,
          state,
          country,
          zipcode,
          currency,
          default: defaultvalue,
          last4Digits: null,
          isVerified: true
        });

        return {
          status: payout ? 200 : 400
        }

      } else if (methodId == 2) {

        try {
          const paymentCurrency = await PaymentMethods.findOne({
            attributes: ['currency'],
            where: {
              id: 2
            }
          });

          currency = paymentCurrency ? paymentCurrency.currency : currency;
          business_type = businessType ? businessType : 'individual';
          external_account = {
            object: "bank_account",
            country: country,
            currency: currency,
            account_number: accountNumber
          };

          if (!isEuropeCountry(country) && routingNumber) { // Non Europe countries - Routing Number param
            external_account['routing_number'] = routingNumber;
          }
          if (business_type === 'individual') {
            createPayout = await stripe.accounts.create({
              type: "custom",
              country: country,
              email: payEmail,
              requested_capabilities,
              external_account,
              account_token: accountToken,
              metadata: {
                userId: request.user.id
              }
            });

            stripeAccountId = createPayout.id;

          } else if (business_type === 'company') {
            if (!personToken) {
              person = {
                email: payEmail,
                address: {
                  line1: address1,
                  city: city,
                  state: state,
                  country: country,
                  postal_code: zipcode
                },
                relationship: {
                  representative: true
                }
              };
              createPersonToken = await stripe.tokens.create({ person });
              if (createPersonToken) {
                personToken = createPersonToken.id;
              } else {
                status = 400;
                errorMessage = createPersonToken.message || (createPersonToken.error && createPersonToken.error.message);
              };
            }

            createPayout = await stripe.accounts.create({
              type: "custom",
              country,
              email: payEmail,
              requested_capabilities,
              external_account,
              account_token: accountToken,
              metadata: {
                userId: request.user.id
              }
            });

            stripeAccountId = createPayout.id;
            // Because this is a business (and not an individual), we'll need to specify
            // the account opener by email address using the Persons API.
            await stripe.account.createPerson(stripeAccountId, {
              person_token: personToken
            });
          }

          const successUrl = url + '/user/payout/success?account=' + stripeAccountId;
          const failureUrl = url + '/user/payout/failure?account=' + stripeAccountId;

          const accountLinks = await stripe.accountLinks.create({
            account: stripeAccountId,
            failure_url: failureUrl,
            success_url: successUrl,
            type: 'custom_account_verification',
            collect: 'currently_due', // currently_due or eventually_due
          });

          connectUrl = accountLinks.url; // Account links API on-boarding URL

          return {
            status,
            errorMessage,
            connectUrl,
            successUrl,
            failureUrl,
            stripeAccountId
          }

        } catch (error) {
          return {
            status: 400,
            errorMessage: error.message
          }
        }
      } else {
        return {
          status: 400,
          errorMessage: await showErrorMessage({ errorCode: 'choosePaymentMethod' })
        }
      }
    } catch (error) {
      return {
        status: 400,
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error: error.message })
      }
    }
  },
};

export default addPayout;
