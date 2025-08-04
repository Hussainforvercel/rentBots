import {
  GraphQLString as StringType,
} from 'graphql';
import stripePackage from 'stripe';
import UserType from '../../types/UserType.js';
import { payment } from '../../../config.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const stripe = stripePackage(payment.stripe.secretKey);

const testToken = {
  type: UserType,
  args: {
    token: { type: StringType }
  },
  async resolve({ request, response }, {
    token
  }) {

    try {
      let createCard = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4111111111111111',
          exp_month: 2,
          exp_year: 2031,
          cvc: '314'
        },
      })

      return {
        userToken: createCard && createCard.id,
        status: 200
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      }
    }
  }
};

export default testToken;