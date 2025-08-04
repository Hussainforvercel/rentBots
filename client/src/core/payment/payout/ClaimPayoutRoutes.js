import { Reservation } from '../../../data/models';
import { createTransactionHistory } from '../../payment/payout/createTransactionHistory';
import { paymentTransfer } from './paymentTransfer';
import { getTransactionFee } from './getTransactionFee';

export async function paypalclaimPayout(reservationId, hostEmail, amount, currency, payoutId, hostId, claimPaymentAttempt) {

    try {

        if (claimPaymentAttempt >= 0) await Reservation.update({ claimPaymentAttempt: claimPaymentAttempt + 1 }, {
            where: {
                id: reservationId
            }
        });

        let addPayout, batchStatus, transactionId, getPayout, fees;
        addPayout = await paymentTransfer(reservationId, amount, currency, hostEmail);

        batchStatus = addPayout?.data?.batch_header?.batch_status;
        transactionId = addPayout?.data?.batch_header?.payout_batch_id;

        if (!["PENDING", "PROCESSING", "SUCCESS"].includes(batchStatus)) {
            return { status: 400, errorMessage: addPayout?.errorMessage }
        }

        getPayout = await getTransactionFee(transactionId);
        fees = getPayout?.batch_header?.fees?.value;

        await createTransactionHistory(
            reservationId,
            hostEmail,
            payoutId,
            amount,
            fees,
            currency,
            hostId,
            transactionId,
            1,
            'claimPayout'
        );

        return ({ status: 200, errorMessage: null })

    } catch (error) {
        return {
            status: 400,
            errorMessage: error
        }
    }
}
