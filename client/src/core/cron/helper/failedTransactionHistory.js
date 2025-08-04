import { FailedTransactionHistory } from "../../../data/models";



export const failedTransactionHistory = async ({ reservationId, userId, amount, currency, reason, paymentMethodId, payoutType }) => {

    let checkFailedTransaction = await FailedTransactionHistory.findOne({
        where: {
            reservationId,
            payoutType
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
            payoutType
        });
    } else {
        await FailedTransactionHistory.update({
            userId,
            amount,
            currency,
            reason,
            paymentMethodId,
            createdAt: new Date(),
            updatedAt: new Date(),
            payoutType
        }, {
            where: { reservationId }
        });
    }
}