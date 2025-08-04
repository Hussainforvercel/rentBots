import { payment as config } from '../../config';
import { updateReservation } from './updateReservation';
import { createTransaction } from './createTransaction';
import { createThread } from './createThread';
import { blockDates } from './blockDates';
import { emailBroadcast } from './email';
import { createPayPalPayment } from './paypal/createPayPalPayment';
import { makePayPalPayment } from './paypal/makePayPalPayment';

const paypalRoutes = app => {

  app.get('/cancel', async function (req, res) {
    var reservationId = req.query.id;
    res.redirect('/payment/' + reservationId);
  });

  app.get('/success', async function (req, res) {

    let tokenId = req?.query?.token;
    const { data, results } = await makePayPalPayment(tokenId);
    if (data?.status == 'COMPLETED') {
      const extractedDatas = results?.map((item) => {
        return {
          reservationId: item?.reservationId,
          receiverEmail: item?.receiverEmail,
          receiverId: item?.receiverId,
          transactionId: item?.transactionId,
          total: item?.total,
          transactionFee: item?.transactionFee,
          currency_code: item?.currency_code
        };
      });

      const value = extractedDatas[0], reservationId = value?.reservationId, receiverEmail = value?.receiverEmail, receiverId = value?.receiverId;
      const transactionId = value?.transactionId, total = value?.total, transactionFee = value?.transactionFee, currency = value?.currency_code;
      const payerEmail = data?.payment_source.paypal?.email_address;
      const payerId = data?.payment_source?.paypal?.account_id;

      await updateReservation(reservationId);
      await createTransaction(
        reservationId,
        payerEmail,
        payerId,
        receiverEmail,
        receiverId,
        transactionId,
        total,
        transactionFee,
        currency,
        ""
      );
      await createThread(reservationId);
      await blockDates(reservationId);
      await emailBroadcast(reservationId);
      res.redirect(config.paypal.redirectURL.success + "/" + reservationId);
    } else {
      console.log("Error Payment not completed")
      res.status(400).send({ status: 400, errorMessge: 'Payment not completed' });
    }

  });

  app.post('/paynow', async function (req, res) {

    let reservationId, paypalPayAmount, paymentCurrency, redirectUrl;
    reservationId = req?.body?.reservationId;
    paypalPayAmount = req?.body?.amount;
    paymentCurrency = req?.body?.currency;
    const paypalPayment = await createPayPalPayment(reservationId, paypalPayAmount, paymentCurrency);
    redirectUrl = paypalPayment?.data && paypalPayment?.data.links?.find(link => link?.rel === 'payer-action').href;
    if (paypalPayment.status == 200) {
      res.send({ status: 200, redirect: redirectUrl });
    } else {
      res.send({ status: paypalPayment.status, errorMessage: paypalPayment?.errorMessage });
    }
  });

};

export default paypalRoutes;