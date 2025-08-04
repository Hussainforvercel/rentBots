import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';
import stripePackage from 'stripe';
// import { Reservation, ListingData } from '../../models';
import Reservation from '../../models/Reservation.js'
import ListingData from '../../models/ListingData.js'
import ReservationPaymentType from '../../types/ReservationPaymentType.js';
import { getCustomerId, getCustomerEmail } from '../../../libs/payment/stripe/helpers/getCustomerId.js';
import { createThread } from '../../../libs/payment/stripe/helpers/createThread.js';
import { updateReservation } from '../../../libs/payment/stripe/helpers/updateReservation.js';
import { blockDates } from '../../../libs/payment/stripe/helpers/blockDates.js';
import { createTransaction } from '../../../libs/payment/stripe/helpers/createTransaction.js';
import { emailBroadcast } from '../../../libs/payment/stripe/helpers/email.js';
import { payment } from '../../../config.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const stripe = stripePackage(payment.stripe.secretKey);

const confirmReservation = {
  type: ReservationPaymentType,
  args: {
    reservationId: { type: new NonNull(IntType) },
    paymentIntentId: { type: new NonNull(StringType) },
    paymentType: { type: new NonNull(IntType) }
  },
  async resolve({ request, res }, {
    reservationId,
    paymentIntentId,
    paymentType
  }) {

    try {
      let customerId, customerEmail, confirmIntent, amount = 0, status = 200, errorMessage;
      let requireAdditionalAction = false, paymentIntentSecret;
      // Check if user already logged in
      if (request.user && !request.user.admin) {

        const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
        if (userStatusErrorMessage) {
          return {
            status: userStatusError,
            errorMessage: userStatusErrorMessage
          };
        }

        let userId = request.user.id;
        let reservation = await Reservation.findOne({
          where: {
            id: reservationId
          }
        });

        if (reservation) {
          const listingData = await ListingData.findOne({
            attributes: ['currency'],
            where: {
              listId: reservation && reservation.dataValues && reservation.dataValues.listId
            },
            raw: true
          });

          customerId = await getCustomerId(userId);
          customerEmail = await getCustomerEmail(userId);
          amount = (reservation.dataValues && reservation.dataValues.total) + (reservation.dataValues && reservation.dataValues.guestServiceFee);
          if (paymentType == 3 || paymentType == 4) {
            try {
              let reservation = await Reservation.findOne({
                where: {
                  id: reservationId,
                  paymentIntentId
                }
              });

              if (reservation) {
                confirmIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
              }

              if (confirmIntent && confirmIntent.status === 'succeeded') {
                paymentIntentSecret = confirmIntent.client_secret;
                status = 200;
              } else {
                status = 400;
                errorMessage = await showErrorMessage({ errorCode: 'wrongError' })
              }
            } catch (error) {
              status = 400;
              errorMessage = error.message;
            }
          } else {
            try {
              confirmIntent = await stripe.paymentIntents.confirm(paymentIntentId);
              if (confirmIntent && (confirmIntent.status === 'requires_source_action' || confirmIntent.status === "requires_action") && confirmIntent.next_action && confirmIntent.next_action.type === 'use_stripe_sdk') {
                status = 400;
                requireAdditionalAction = true;
                paymentIntentSecret = confirmIntent.client_secret;
              } else if (confirmIntent && confirmIntent.status === 'succeeded') {
                status = 200;
              } else {
                status = 400;
                errorMessage = await showErrorMessage({ errorCode: 'cardError' })
              }
            } catch (error) {
              status = 400;
              errorMessage = error.message;
            }
          }

          if (status === 200 && confirmIntent && 'id' in confirmIntent) {
            await updateReservation(reservationId, confirmIntent.id);
            await createThread(reservationId);
            await blockDates(reservationId);
            await createTransaction(
              reservationId,
              customerEmail,
              customerId,
              confirmIntent.id,
              amount.toFixed(2),
              listingData.currency,
              'booking',
              paymentType
            );
            emailBroadcast(reservationId);
          }

          return await {
            results: reservation,
            status,
            errorMessage,
            requireAdditionalAction,
            paymentIntentSecret,
            reservationId
          };
        } else {
          return {
            errorMessage: errorMessage ? errorMessage : await showErrorMessage({ errorCode: 'processError' }),
            status: 400
          };
        }
      } else {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: 'checkLoginAccount' })
        }
      }
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default confirmReservation;