var CronJob = require('cron').CronJob;
const AllowedLimit = require('async-sema').RateLimit(10);

import { convert } from '../../helpers/currencyConvertion';
import { paypalclaimPayout } from '../payment/payout/ClaimPayoutRoutes';
import { stripeClaimPayout } from '../payment/stripe/stripeClaimpayout';
import { failedTransactionHistory } from './helper/failedTransactionHistory';

import {
  Reservation,
  Payout,
  User,
  Currencies,
  CurrencyRates,
} from '../../data/models';

import sequelize from '../../data/sequelize';


const autoClaimPayoutToHost = app => {

  new CronJob('0 0 0 * * *', async function () { // Run every day on 12.00 AM

    console.log("/********************************************/");
    console.log("HOLY MOLY AUTO CLAIM PAYOUT TO HOST CRON STARTED");

    try {

      let ratesData = {}, attributes = [], having = {}, offset = 0, limit = 100, totalPages = 1;

      attributes = [
        'id',
        'claimPayout',
        'claimRequestDate',
        'currency',
        'hostId',
        'reservationState',
        'claimPaymentAttempt',
        'paymentState',
        'isClaimPaidOut',
        'claimStatus',
        'isHold',
        [sequelize.literal('TIMESTAMPDIFF(HOUR, claimRequestDate, NOW())'), 'day_difference']
      ]

      having = {
        'day_difference': {
          $lt: 24
        },
        $or: [{
          reservationState: 'completed'
        },
        {
          reservationState: 'cancelled'
        }
        ],
        paymentState: 'completed',
        claimStatus: 'approved',
        isClaimPaidOut: false,
        isHold: false,
        claimPaymentAttempt: {
          $lt: 3
        },
      }

      const getReservationCount = await Reservation.findAll({
        attributes,
        having,
        raw: true
      });

      if (getReservationCount && getReservationCount?.length > 0) {

        totalPages = Math.floor((getReservationCount?.length - 1) / limit) + 1;

        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

          offset = (currentPage - 1) * limit;

          const getReservation = await Reservation.findAll({
            limit,
            attributes,
            offset,
            having,
            order: [
              ['id', 'DESC']
            ],
            raw: true
          });

          const data = await CurrencyRates.findAll();
          const base = await Currencies.findOne({
            where: {
              isBaseCurrency: true
            }
          });

          if (data) {
            data.map((item) => {
              ratesData[item.dataValues.currencyCode] = item.dataValues.rate;
            })
          };

          if (getReservation && getReservation.length > 0) {
            await Promise.all(getReservation.map(async (item, index) => {

              await AllowedLimit();
              let status = 200, errorMessage, amount = 0, payoutId, convertAmount = 0, checkFailedTransaction, paymentStatus;

              let checkUserStatus = await User.findOne({
                attributes: ['id', 'email'],
                where: {
                  id: item.hostId,
                  userBanStatus: false,
                  userDeletedAt: null
                },
                raw: true
              });

              let getPayout = await Payout.findOne({
                attributes: ['id', 'methodId', 'payEmail'],
                where: {
                  userId: item.hostId,
                  default: true
                },
                raw: true
              });
              payoutId = getPayout && getPayout.id;

              convertAmount = convert(base.symbol, ratesData, item.claimPayout, item.currency, base.symbol);
              amount = convertAmount.toFixed(2);

              if (getPayout && getPayout.payEmail && checkUserStatus && amount > 0) {

                if (getPayout.methodId === 1) {
                  paymentStatus = await paypalclaimPayout(item.id, checkUserStatus.email, amount, base.symbol, payoutId, item.hostId, item.claimPaymentAttempt)
                  status = paymentStatus['status']
                  errorMessage = paymentStatus['errorMessage']

                } else if (getPayout.methodId === 2) {

                  paymentStatus = await stripeClaimPayout(item.id, getPayout.payEmail, amount, base.symbol, checkUserStatus.email, payoutId, item.hostId, item.claimPaymentAttempt)
                  status = paymentStatus['status']
                  errorMessage = paymentStatus['errorMessage']
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
                    payoutType: 'claimPayout'
                  });
                } else if (status == 200) {
                  await Reservation.update({ isClaimPaidOut: true }, { where: { id: item.id } });
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

export default autoClaimPayoutToHost;