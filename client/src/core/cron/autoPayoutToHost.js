var CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(10);
import {
  Reservation,
  Payout,
  CancellationDetails,
  User,
  Currencies,
  CurrencyRates,
} from '../../data/models';
import { convert } from '../../helpers/currencyConvertion';
import { paypalTransaction } from './helper/paypalTransaction';
import { stripePayment } from './helper/stripeTransaction';
import { failedTransactionHistory } from './helper/failedTransactionHistory';

const autoPayoutToHost = app => {

  new CronJob('0 0 0 * * *', async function () { // Run every day on 12.00 AM

    console.log("/********************************************/");
    console.log("HOLY MOLY AUTO PAYOUT TO HOST CRON STARTED");

    try {
      let ratesData = {}, where = {}, offset = 0, limit = 100, totalPages = 1;

      where = {
        $or: [{
          reservationState: 'completed'
        },
        {
          reservationState: 'cancelled'
        }
        ],
        paymentState: 'completed',
        isHold: false,
        paymentAttempt: {
          $lt: 3
        },
        payoutTransactionId: {
          $eq: null
        }
      };

      const getReservationCount = await Reservation.count({
        where
      });

      if (getReservationCount && getReservationCount > 0) {

        totalPages = Math.floor((getReservationCount - 1) / limit) + 1;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

          offset = (currentPage - 1) * limit;

          const getReservation = await Reservation.findAll({
            limit,
            offset,
            attributes: ['id', 'hostId', 'hostServiceFee', 'total', 'currency', 'paymentAttempt', 'reservationState', 'isHold', 'paymentState', 'payoutTransactionId'],
            where,
            order: [
              ['id', 'DESC']
            ],
            raw: true
          });

          const data = await CurrencyRates.findAll();
          const base = await Currencies.findOne({
            where: { isBaseCurrency: true }
          });

          if (data) {
            data.map((item) => {
              ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
            })
          };

          if (getReservation && getReservation.length > 0) {
            await Promise.all(getReservation.map(async (item, index) => {
              await AllowedLimit();
              let status = 200, errorMessage, amount = 0, payoutId, convertAmount = 0;
              const checkUserStatus = await User.findOne({
                attributes: ['id', 'email'],
                where: {
                  id: item.hostId,
                  userBanStatus: false,
                  userDeletedAt: null
                },
                raw: true
              });

              const getPayout = await Payout.findOne({
                attributes: ['id', 'methodId', 'payEmail'],
                where: {
                  userId: item.hostId,
                  default: true
                },
                raw: true
              });
              payoutId = getPayout && getPayout.id;

              if (item.reservationState === 'completed') {
                let payoutAmount = item.total - item.hostServiceFee;
                convertAmount = convert(base.symbol, ratesData, payoutAmount, item.currency, base.symbol);

              } else if (item.reservationState === 'cancelled') {
                let refundAmount = await CancellationDetails.findOne({
                  attributes: ['payoutToHost', 'currency'],
                  where: {
                    reservationId: item.id
                  },
                  raw: true
                });
                if (refundAmount && refundAmount.payoutToHost) convertAmount = convert(base.symbol, ratesData, Number(refundAmount.payoutToHost), refundAmount.currency, base.symbol);
              }
              amount = convertAmount.toFixed(2);
              if (getPayout && getPayout.payEmail && checkUserStatus != null && amount > 0) {
                if (getPayout.methodId === 1) {
                  await paypalTransaction(item.id, item.hostId, amount, base.symbol, getPayout.payEmail, item.paymentAttempt, payoutId)
                    .then(res => {
                      status = res.status;
                      errorMessage = res.errorMessage;
                    });
                } else if (getPayout.methodId === 2) {
                  await stripePayment(item.id, getPayout.payEmail, amount, base.symbol, checkUserStatus.email, payoutId, item.hostId, item.paymentAttempt)
                    .then(res => {
                      status = res.status;
                      errorMessage = res.errorMessage;
                    });
                }

                if (status == 400) {
                  await failedTransactionHistory({
                    reservationId: item.id,
                    userId: item.hostId,
                    amount,
                    currency: base.symbol,
                    reason: errorMessage,
                    paymentMethodId: getPayout.methodId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    payoutType: 'payout'
                  });
                }
              }
            }));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

  }, null, true, 'America/Los_Angeles');
}

export default autoPayoutToHost;