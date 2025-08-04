import stripePackage from 'stripe';
const stripe = stripePackage(payment.stripe.secretKey);
import { TransactionHistory } from '../../../data/models';
import { isZeroDecimalCurrency } from '../../../helpers/zeroDecimalCurrency';
import { updateReservationData, getPayoutReservation } from '../../../helpers/updateReservationData';
import { payment } from '../../../config';

export async function stripePayment(reservationId, payEmail, amount, currency, hostEmail, payoutId, hostId, paymentAttempt) {
    try {

        await updateReservationData({ id: reservationId, updateData: { paymentAttempt: paymentAttempt + 1 } });
        const reservationCount = await getPayoutReservation({ id: reservationId });

        if (reservationCount > 0) {
            return { status: 200 };
        }

        const payout = await stripe.transfers.create({
            amount: isZeroDecimalCurrency(currency) ? Math.round(amount) : Math.round(amount * 100),
            currency,
            destination: payEmail,
            transfer_group: 'Payout to Host',
            metadata: {
                reservationId,
                type: 'payout',
                hostEmail
            }
        });

        if (payout && payout.id) {
            await TransactionHistory.create({
                reservationId,
                userId: hostId,
                payoutId,
                payoutEmail: hostEmail,
                amount,
                currency,
                transactionId: payout.id,
                paymentMethodId: 2,
                payoutType: 'payout'
            });
            await updateReservationData({ id: reservationId, updateData: { payoutTransactionId: payout?.id } });
            return { status: 200 };
        }
    } catch (error) {
        return {
            status: 400,
            errorMessage: error.message
        }
    }
}