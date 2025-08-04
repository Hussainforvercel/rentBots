import stripePackage from 'stripe';
import { payment } from '../../../../config';
const stripe = stripePackage(payment.stripe.secretKey);
import { updateReservation } from './updateReservation'
import { createThread } from './createThread'
import { blockDates } from './blockDates'
import { createTransaction } from './createTransaction';
import { emailBroadcast } from './email'
import { isZeroDecimalCurrency } from '../../../../helpers/zeroDecimalCurrency';
import { removeSpecialCharacter } from '../../../../helpers/removeSpecialCharacter';

const updatePaymentData = async ({ reservationDetails, paymentIntentId, customerId, intent }) => {
    try {
        await updateReservation(reservationDetails.reservationId, paymentIntentId);
        await createThread(reservationDetails.reservationId);
        await blockDates(reservationDetails.reservationId);
        await createTransaction(
            reservationDetails.reservationId,
            reservationDetails.guestEmail,
            customerId,
            intent.id,
            reservationDetails.amount,
            reservationDetails.currency,
            'booking',
            2
        );
        emailBroadcast(reservationDetails.reservationId);
    }
    catch (error) {
        return false;
    }
}


const confirmPaymentIntent = async ({ confirmPaymentIntentId }) => {
    try {
        const confirmIntent = await stripe.paymentIntents.confirm(confirmPaymentIntentId);
        return {
            confirmIntent,
            intentStatus: 200
        };
    } catch (error) {
        return {
            intentStatus: 400,
            error: error?.message
        };
    }
}

const createPaymentIntent = async ({ paymentMethodId, reservationDetails, customerId }) => {
    try {
        const siteName = await removeSpecialCharacter();
        const intent = await stripe.paymentIntents.create({
            payment_method: paymentMethodId,
            amount: isZeroDecimalCurrency(reservationDetails.currency) ? Math.round(reservationDetails.amount) : Math.round(reservationDetails.amount * 100),
            currency: reservationDetails.currency,
            payment_method_types: ['card'],
            confirmation_method: 'manual',
            confirm: true,
            customer: customerId,
            description: 'Reservation from the Web - Booking ID: ' + reservationDetails?.reservationId,
            statement_descriptor_suffix: siteName,
            metadata: { "Ref Booking ID": reservationDetails?.reservationId }
        });
        return intent;
    } catch (error) {
        return false;
    }
}

const createCustomerData = async ({ reservationDetails }) => {
    try {
        const createCustomer = await stripe.customers.create(
            { email: reservationDetails.guestEmail }
        );
        return {
            createCustomer,
            customerStatus: 200
        };
    } catch (error) {
        return {
            customerStatus: 400,
            error: error?.message
        };
    }
}

export {
    updatePaymentData,
    createPaymentIntent,
    confirmPaymentIntent,
    createCustomerData
}