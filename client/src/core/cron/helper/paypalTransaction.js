import { createTransactionHistory } from '../../payment/payout/createTransactionHistory';
import { paymentTransfer } from '../../payment/payout/paymentTransfer';
import { getTransactionFee } from '../../payment/payout/getTransactionFee';
import { updateReservationData, getPayoutReservation } from '../../../helpers/updateReservationData';

export async function paypalTransaction(reservationId, hostId, amount, currency, hostEmail, paymentAttempt, payoutId) {

	try {
		let paymentAmount = Math.round(amount);

		await updateReservationData({ id: reservationId, updateData: { paymentAttempt: paymentAttempt + 1 } });
		const reservationCount = await getPayoutReservation({ id: reservationId });
		if (reservationCount <= 0) {
			let addPayout, batchStatus, transactionId, getPayout, fees;
			addPayout = await paymentTransfer(reservationId, paymentAmount, currency, hostEmail);
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
				'payout'
			);
			await updateReservationData({ id: reservationId, updateData: { payoutTransactionId: transactionId } });
		}
		return { status: 200, errorMessage: null };
	} catch (error) {
		return {
			status: 400,
			errorMessage: error
		}
	}
}
