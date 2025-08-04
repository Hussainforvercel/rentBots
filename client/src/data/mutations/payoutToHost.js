import { GraphQLInt as IntType } from 'graphql';
const AllowedLimit = require('async-sema').RateLimit(10);
import {
    Reservation,
    Payout,
    TransactionHistory,
    CancellationDetails,
    FailedTransactionHistory,
    User,
    Currencies,
    CurrencyRates,
} from '../../data/models';
import ReservationType from "../types/ReservationType";
import { convert } from "../../helpers/currencyConvertion";
import { paypalTransaction } from "../../core/cron/helper/paypalTransaction";
import { stripePayment } from "../../core/cron/helper/stripeTransaction";

const payoutToHost = {

    type: ReservationType,

    args: {
        reservationId: { type: IntType },
        confirmationCode: { type: IntType }
    },

    async resolve({ request }, { reservationId, confirmationCode }) {

        let transactionId = [], where, status = 200, offset = 0, errorMessage = null;

        if (!request?.user?.admin) {
            return {
                status: 400,
                errorMessage: 'Please login as an admin and try again'
            }
        };

        autoPayout(offset);

        async function autoPayout(offset) {
            try {
                if (reservationId && confirmationCode) {
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
                        id: reservationId,
                        confirmationCode
                    }
                } else {
                    const getTransaction = await TransactionHistory.findAll({
                        attributes: ['reservationId'],
                        where: { payoutType: 'payout' },
                        raw: true
                    });

                    transactionId = getTransaction.map((item) => {
                        return item.reservationId
                    })

                    transactionId = transactionId && transactionId.length > 0 ? transactionId : [0];

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
                        id: {
                            $notIn: transactionId
                        }
                    }
                }

                const getReservation = await Reservation.findAll({
                    limit: 1000,
                    offset,
                    attributes: ['id', 'hostId', 'hostServiceFee', 'total', 'currency', 'paymentAttempt', 'reservationState', 'isHold', 'paymentState'],
                    where,
                    order: [
                        ['id', 'DESC']
                    ],
                    raw: true
                });

                var ratesData = {};

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
                        let amount = 0, payoutId, convertAmount = 0, checkFailedTransaction;

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
                        if (item.reservationState === 'completed') {
                            let payoutAmount = item.total - item.hostServiceFee;
                            convertAmount = convert(base.symbol, ratesData, payoutAmount, item.currency, base.symbol);

                        } else if (item.reservationState === 'cancelled') {
                            let refundAmount = await CancellationDetails.findOne({
                                attributes: ['payoutToHost'],
                                where: {
                                    reservationId: item.id
                                },
                                raw: true
                            });
                            if (refundAmount && refundAmount.payoutToHost) convertAmount = convert(base.symbol, ratesData, Number(refundAmount.payoutToHost), item.currency, base.symbol);
                        }

                        amount = convertAmount.toFixed(2);

                        if (getPayout && getPayout.payEmail && checkUserStatus != null && amount > 0) {

                            if (getPayout.methodId === 1) {
                                await paypalTransaction(item.id, item.hostId, amount, base.symbol, checkUserStatus.email, item.paymentAttempt, payoutId)
                                    .then(res => {
                                        console.log('res=>', res);
                                        status = res.status;
                                        errorMessage = res.errorMessage;
                                    });

                            } else if (getPayout.methodId === 2) {
                                await stripePayment(item.id, getPayout.payEmail, amount, base.symbol, checkUserStatus.email, payoutId, item.hostId, item.paymentAttempt)
                                    .then(res => {
                                        console.log('res=>', res);
                                        status = res.status;
                                        errorMessage = res.errorMessage;
                                    });
                            }
                            if (status == 400) {
                                checkFailedTransaction = await FailedTransactionHistory.findOne({
                                    where: {
                                        reservationId: item.id,
                                        payoutType: 'payout'
                                    },
                                    raw: true
                                });
                                if (checkFailedTransaction === null) {
                                    await FailedTransactionHistory.create({
                                        reservationId: item.id,
                                        userId: item.hostId,
                                        amount,
                                        currency: item.currency,
                                        reason: errorMessage,
                                        paymentMethodId: getPayout.methodId,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                        payoutType: 'payout'
                                    });

                                } else {
                                    await FailedTransactionHistory.update({
                                        userId: item.hostId,
                                        amount,
                                        currency: item.currency,
                                        reason: errorMessage,
                                        paymentMethodId: getPayout.methodId,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                        payoutType: 'payout'
                                    }, {
                                        where: {
                                            reservationId: item.id
                                        }
                                    });
                                }
                            }
                        }

                    }));
                }

            } catch (error) {
                return {
                    status,
                    errorMessage
                }
            }
        }
        return {
            status: status,
            errorMessage: errorMessage
        }
    }
}

export default payoutToHost;
