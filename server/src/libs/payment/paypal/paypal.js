// import { updateReservation, getReservation } from '../stripe/helpers/updateReservation';
// import { createTransaction } from './helpers/createTransaction';
// import { createThread } from '../stripe/helpers/createThread';
// import { blockDates } from '../stripe/helpers/blockDates';
// import { emailBroadcast } from '../stripe/helpers/email';
// import { makePayPalPayment } from './makePayPalPayment';
import showErrorMessage from '../../../helpers/showErrorMessage.js';

const paypalRoutes = app => {

  app.get('/cancel', async function (req, res) {
    res.send({ status: 400, errorMessage: await showErrorMessage({ errorCode: 'paymentCancelled' }) });
  });

  app.get('/success', async function (req, res) {
    // let tokenId = req.query.token;
    // const { data, results } = await makePayPalPayment(tokenId);

    // if (data && data.status == 'COMPLETED') {
    //   const extractedDatas = results && results.map((item) => {
    //     return {
    //       reservationId: item.reservationId,
    //       receiverEmail: item.receiverEmail,
    //       receiverId: item.receiverId,
    //       transactionId: item.transactionId,
    //       total: item.total,
    //       transactionFee: item.transactionFee,
    //       currency_code: item.currency_code
    //     };
    //   });

    //   const value = extractedDatas[0], reservationId = value.reservationId, receiverEmail = value.receiverEmail, receiverId = value.receiverId;
    //   const transactionId = value.transactionId, total = value.total, transactionFee = value.transactionFee, currency = value.currency_code;

    //   const payerEmail = data.payment_source.paypal.email_address;
    //   const payerId = data.payment_source.paypal.account_id;
    //   await updateReservation(reservationId);

    //   await createTransaction(
    //     reservationId,
    //     payerEmail,
    //     payerId,
    //     receiverEmail,
    //     receiverId,
    //     transactionId,
    //     total,
    //     transactionFee,
    //     currency,
    //     ""
    //   );
    //   await createThread(reservationId);
    //   await blockDates(reservationId);
    //   await emailBroadcast(reservationId);
    //   let reservation = await getReservation(reservationId);

    //   res.send({ status: 200, payment_status: data.status, reservationId, reservation });
    // } else {
    //   res.status(400).send({ status: 400, errorMessge: showErrorMessage({ errorCode: 'paymentNotComplete' }) });
    // }
  });
};

export default paypalRoutes;