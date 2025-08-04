import { TransactionHistory, Reservation, CurrencyRates, CancellationDetails, Currencies } from '../../data/models';
import sequelize from '../../data/sequelize';
import { getCompletedResult, getFutureResult, getGrossResult } from './transactionCsvHelper';

const getTransactions = async ({ hostId, toCurrency, type, listId, payoutId }) => {
    try {
        let rates = {}, result = [];
        let transactionHistoryFilter = {}, listingFilter = {}, payoutFilter = {};

        if ((type === 'completed' || type === 'grossEarnings')) {
            payoutFilter = {
                $or: [
                    {
                        reservationState: 'completed'
                    }, {
                        $and: [
                            { reservationState: 'cancelled' },
                            {
                                id: {
                                    $in: [
                                        sequelize.literal(`SELECT reservationId FROM CancellationDetails where payoutToHost > 0`)
                                    ]
                                }
                            }
                        ]
                    }
                ]
            };
            if (payoutId && payoutId > 0) transactionHistoryFilter = { id: { $in: [sequelize.literal(`SELECT reservationId FROM TransactionHistory where payoutId=${payoutId}`)] } };
        }
        else if (type === 'future') {
            transactionHistoryFilter = {
                id: { $notIn: [sequelize.literal("SELECT reservationId FROM TransactionHistory")] },
            };
            payoutFilter = {
                reservationState: 'approved'
            };
        }

        if (listId) listingFilter = { listId };

        const reservations = await Reservation.findAll({
            attributes: [
                'currency',
                'total',
                'hostServiceFee',
                'checkIn',
                'checkOut',
                'confirmationCode',
                'createdAt',
                'reservationState',
                ['listTitle', 'listTitle'],
                [sequelize.literal(`(SELECT title FROM Listing WHERE id=Reservation.listId)`), 'title'],
                [sequelize.literal(`(SELECT firstName FROM UserProfile WHERE userId=Reservation.guestId)`), 'firstName'],
                [
                    sequelize.literal(`(
                        SELECT 
                            CASE WHEN methodId=1
                                THEN payEmail
                            ELSE 
                                IF(methodId=2, CONCAT("******",last4Digits), "")
                            END
                        FROM 
                            Payout 
                        WHERE 
                            id=Reservation.payoutId AND isVerified=true
                        )`),
                    'payoutAccount'
                ]
            ],
            where: {
                $and: [
                    { hostId },
                    { paymentState: 'completed' },
                    transactionHistoryFilter,
                    listingFilter,
                    payoutFilter
                ]
            },
            include: [
                {
                    model: TransactionHistory,
                    attributes: ['createdAt', 'amount', 'payoutEmail', 'currency'],
                    as: 'transactionHistory',
                    where: { userId: hostId },
                    required: false
                },
                {
                    model: CancellationDetails,
                    attributes: ['payoutToHost', 'currency'],
                    as: 'cancellationDetails'
                }
            ],
            order: [['checkIn', 'ASC']],
            raw: true
        });

        if (reservations.length <= 0) return [];

        const data = await CurrencyRates.findAll();
        const base = await Currencies.findOne({ where: { isBaseCurrency: true } });

        if (data) data.map((item) => rates[item.dataValues.currencyCode] = item.dataValues.rate);
        result = reservations.map((reservation, key) => {
            if (type === 'completed') return getCompletedResult({ data, base, rates, reservation, toCurrency });
            if (type === 'grossEarnings') return getGrossResult({ data, base, rates, reservation, toCurrency });
            if (type === 'future') return getFutureResult({ data, base, rates, reservation, toCurrency });
        });

        return result;

    } catch (error) {
        console.error(error);
        return [];
    }
}

export { getTransactions };