import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);
import showErrorMessage from '../../../../helpers/showErrorMessage.js';
import { getCustomerId, getCustomerEmail } from './getCustomerId.js';
import { updateUserProfile } from './updateUserProfile.js';
import { updateReservation } from './updateReservation.js';
import { createTransaction } from './createTransaction.js';
import { createThread } from './createThread.js';
import { blockDates } from './blockDates.js';
import { emailBroadcast } from './email.js';
import { isZeroDecimalCurrency } from '../../../../helpers/zeroDecimalCurrency.js';
import { payment } from '../../../../config.js';
import { removeSpecialCharacter } from '../../../../helpers/removeSpecialCharacter.js';

export async function createCustomer(userId) {
    let customerId, customerEmail, status = 200, errorMessage;
    customerId = await getCustomerId(userId);
    customerEmail = await getCustomerEmail(userId);

    if (!customerId) {
        try {
            let createCustomerData = await stripe.customers.create(
                { email: customerEmail }
            );
            if ('id' in createCustomerData) {
                customerId = createCustomerData.id;
                await updateUserProfile(
                    userId,
                    customerId
                );
            }
        } catch (error) {
            status = 400;
            errorMessage = error.message;
        }
    }

    return {
        status,
        errorMessage,
        customerId,
        customerEmail
    }
}

export async function createStripePayment(cardToken, amount, currency, customerId, customerEmail, reservationId, listId, listTitle) {

    let intent, paymentIntentSecret, requireAdditionalAction = false, status = 200, errorMessage;
    const siteName = await removeSpecialCharacter();

    intent = await stripe.paymentIntents.create({
        payment_method: cardToken,
        amount: isZeroDecimalCurrency(currency) ? Math.round(amount) : Math.round(amount * 100),
        currency: currency,
        payment_method_types: ['card'],
        confirmation_method: 'manual',
        confirm: true,
        customer: customerId,
        description: 'Reservation from the Mobile App: ' + reservationId,
        metadata: {
            reservationId,
            listId: listId,
            title: listTitle
        },
        use_stripe_sdk: true,
        statement_descriptor_suffix: siteName
    });

    if (intent && (intent.status === 'requires_source_action' || intent.status === 'requires_action') && intent.next_action.type === 'use_stripe_sdk') {
        status = 400;
        requireAdditionalAction = true;
        paymentIntentSecret = intent.client_secret;
    } else if (intent && intent.status === 'succeeded') {
        status = 200;
    } else {
        status = 400;
        errorMessage = await showErrorMessage({ errorCode: 'cardError' });
    }

    if (status === 200 && intent && 'id' in intent) {
        await updateReservation(reservationId, intent.id);
        await createThread(reservationId);
        await blockDates(reservationId);
        await createTransaction(
            reservationId,
            customerEmail,
            customerId,
            intent.id,
            amount.toFixed(2),
            currency,
            'booking',
            2
        );
        emailBroadcast(reservationId);
    }

    return {
        status: status,
        errorMessage,
        requireAdditionalAction,
        paymentIntentSecret,
    };
}