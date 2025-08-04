import { FailedTransactionHistory } from '../../../data/models';

export async function createFailedTransactionHistory(
    reservationId,
    userId,
    amount,
    currency,
    reason,
    paymentMethodId
) {

    const checkFailedTransaction = await FailedTransactionHistory.findOne({
        where: {
            reservationId
        },
        raw: true
    });
        
    if (!checkFailedTransaction) {
        await FailedTransactionHistory.create({
            reservationId,
            userId,
            amount,
            currency,
            reason,
            paymentMethodId,
            createdAt: new Date(),
            updatedAt: new Date(),
            payoutType: 'payout'
        });
    } else {
        await FailedTransactionHistory.update({
            amount,
            currency,
            reason,
            paymentMethodId,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            where: {
                reservationId
            }
        });
    }
}