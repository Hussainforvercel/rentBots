import { createTransaction } from './createTransaction';
import { paymentTransfer } from '../payout/paymentTransfer';
import { getTransactionFee } from '../payout/getTransactionFee';

export async function paypalClaimRefund(reservation, transactionData, amount) {
    try {

        let reservationId, receiverEmail, receiverId, payerEmail, payerId, currency;
        let addRefund, batchStatus, getRefund, transactionId, fees;

        reservationId = reservation.id;
        payerEmail = transactionData.receiverEmail;
        payerId = transactionData.receiverId;
        receiverId = transactionData.payerId;
        receiverEmail = transactionData.payerEmail;
        currency = reservation.currency;
        transactionId = transactionData.transactionId;

        addRefund = await paymentTransfer(reservationId, amount, currency, receiverEmail);

        batchStatus = addRefund?.data?.batch_header?.batch_status;
        transactionId = addRefund?.data?.batch_header?.payout_batch_id;

        if (!["PENDING", "PROCESSING", "SUCCESS"].includes(batchStatus)) {
            return { status: 400 };
        }

        getRefund = await getTransactionFee(transactionId);
        fees = getRefund?.batch_header?.fees?.value;

        await createTransaction(
            reservationId,
            receiverEmail,
            receiverId,
            payerId,
            payerEmail,
            transactionId,
            amount,
            fees,
            currency,
            'claimRefund'
        );

        return { status: 200 }

    } catch (error) {
        return { status: 400, errorMessage: error.message };
    }

}

