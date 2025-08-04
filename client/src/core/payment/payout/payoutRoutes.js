import { Reservation, CurrencyRates, Currencies, TransactionHistory, CancellationDetails } from '../../../data/models';
import { createTransactionHistory } from './createTransactionHistory';
import { createFailedTransactionHistory } from './createFailedTransactionHistory';
import { convert } from '../../../helpers/currencyConvertion';
import { paymentTransfer } from './paymentTransfer';
import { getTransactionFee } from './getTransactionFee';
import { updateReservationData } from '../../../helpers/updateReservationData';

const payoutRoutes = app => {

  app.post('/payout', async function (req, res) {
    try {
      if (req.user && req.user.admin == true) {
        let reservationId, hostEmail, payoutId, amount, currency, userId, paymentMethodId, status, errorMessage, ratesData = {};
        reservationId = req?.body?.reservationId;
        hostEmail = req?.body?.hostEmail;
        payoutId = req?.body?.payoutId;
        amount = req?.body?.amount;
        currency = req?.body?.currency;
        userId = req?.body?.userId;
        paymentMethodId = req?.body?.paymentMethodId;

        const transactionHistory = await TransactionHistory.findOne({
          where: {
            reservationId,
            payoutType: 'payout'
          }
        });

        if (transactionHistory) {
          status = 400;
          errorMessage = 'Invalid request';
        } else {
          const reservation = await Reservation.findOne({
            where: {
              id: reservationId,
            },
            raw: true
          });

          const data = await CurrencyRates.findAll();
          const base = await Currencies.findOne({ where: { isBaseCurrency: true } });

          if (data) {
            data.map((item) => {
              ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
            })
          };

          if (reservation) {
            if (reservation.reservationState == 'completed') {

              let reservationPayoutAmount = reservation.total - reservation.hostServiceFee;
              let reservationAmountConversion = convert(base.symbol, ratesData, reservationPayoutAmount, reservation.currency, currency);

              amount <= reservationAmountConversion.toFixed(2)
                ?
                status = 200 : (status = 400, errorMessage = 'Invalid request');

            } else if (reservation.reservationState == 'cancelled') {

              let cancelData = await CancellationDetails.findOne({
                where: {
                  reservationId
                }
              });

              let cancelDataAmount = convert(base.symbol, ratesData, cancelData.payoutToHost, cancelData.currency, currency);

              amount <= cancelDataAmount.toFixed(2)
                ?
                status = 200 : (status = 400, errorMessage = 'Invalid request');

            } else {
              status = 400;
              errorMessage = 'Invalid request';
            }

          } else {
            status = 400;
            errorMessage = 'Invalid requestss';
          };
        };

        if (status == 200) {

          let addPayout, batchStatus, transactionId, getPayout, fees, reason;
          addPayout = await paymentTransfer(reservationId, amount, currency, hostEmail);
          batchStatus = addPayout?.data?.batch_header?.batch_status;
          transactionId = addPayout?.data?.batch_header?.payout_batch_id;
          reason = batchStatus || addPayout?.errorMessage;

          if (!["PENDING", "PROCESSING", "SUCCESS"].includes(batchStatus)) {
            await createFailedTransactionHistory(
              reservationId,
              userId,
              amount,
              currency,
              reason,
              paymentMethodId
            );

            return res.send({ status: 400, errorMessage: addPayout?.errorMessage });
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
            userId,
            transactionId,
            paymentMethodId
          );
          await updateReservationData({ id: reservationId, updateData: { payoutTransactionId: transactionId } });
          return res.send({ status: 'SUCCESS' });
        } else {
          return res.send({ status: 400, errorMessage });
        };

      } else {
        return res.send({ status: 400, errorMessage: 'Invalid request' });
      };
    } catch (err) {
      return res.send({ status: 400, errorMessage: err });
    }

  });
};

export default payoutRoutes;