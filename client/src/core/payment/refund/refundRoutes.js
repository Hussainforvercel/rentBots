import { createTransaction } from './createTransaction';
import { paymentTransfer } from '../payout/paymentTransfer';
import { getTransactionFee } from '../payout/getTransactionFee';

const refundRoutes = app => {

  app.post('/refund', async function (req, res) {
    try {
      let reservationId, receiverEmail, receiverId, payerEmail, payerId, amount, currency;
      let addRefund, batchStatus, getRefund, transactionId, fees;

      reservationId = req?.body?.reservationId;
      receiverEmail = req?.body?.receiverEmail;
      receiverId = req?.body?.receiverId;
      payerEmail = req?.body?.payerEmail;
      payerId = req?.body?.payerId;
      amount = req?.body?.amount;
      currency = req?.body?.currency;

      addRefund = await paymentTransfer(reservationId, amount, currency, receiverEmail);

      batchStatus = addRefund?.data?.batch_header?.batch_status;
      transactionId = addRefund?.data?.batch_header?.payout_batch_id;

      if (!["PENDING", "PROCESSING", "SUCCESS"].includes(batchStatus)) {
        return res.send({ status: 400, errorMessage: addRefund?.errorMessage });
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
        currency
      );

      return res.send({ status: 'SUCCESS' });
    } catch (error) {
      return res.send({ status: 400, errorMessage: error });
    }
  });

};

export default refundRoutes;