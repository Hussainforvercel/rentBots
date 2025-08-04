import { Reservation, TransactionHistory } from '../data/models';

const updatePayoutTransactionId = app => {
	app.post('/updateTransactionId', async function (req, res) {
		let responseStatus = 200, errorMessage;
		try {
			
			const getTransaction = await TransactionHistory.findAll({
				attributes: ['reservationId', 'transactionId', 'id'],
				raw: true
			});

			if (getTransaction && getTransaction?.length > 0) {
				await Promise.all(getTransaction.map(async (item, index) => {
					await Reservation.update({
						payoutTransactionId: item?.transactionId || item?.id
					}, {
						where: {
							id: item?.reservationId
						}
					});
				}));
			}

		} catch (error) {
			responseStatus = 400;
			errorMessage = error.message;
		}
		res.send({ status: responseStatus, errorMessage });
	});
};

export default updatePayoutTransactionId;