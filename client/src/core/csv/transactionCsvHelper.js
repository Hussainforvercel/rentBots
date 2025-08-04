import moment from "moment";
import { convert } from "../../helpers/currencyConvertion";

const getCompletedResult = ({ base, rates, reservation, toCurrency }) => {
    let transactionAmount = reservation['transactionHistory.amount'] && reservation['transactionHistory.amount'],
        total = Number(reservation?.total) - Number(reservation?.hostServiceFee), currency = reservation.currency;
    if (reservation.reservationState == 'cancelled'){
        total = reservation['cancellationDetails.payoutToHost'];
        currency = reservation['cancellationDetails.currency'];
    } 

    return {
        "Date": reservation?.createdAt != null ? moment(reservation?.createdAt).format('DD-MM-YYYY') : '',
        "Transaction Created": reservation['transactionHistory.createdAt'] ? moment(reservation['transactionHistory.createdAt']).format('DD-MM-YYYY') : '-',
        "Transfer to": reservation['transactionHistory.payoutEmail'] ? reservation['transactionHistory.payoutEmail'] : '-',
        "Transaction Amount": transactionAmount > 0 ? (convert(base.symbol, rates, transactionAmount, reservation['transactionHistory.currency'], toCurrency)).toFixed(2) : (transactionAmount ? transactionAmount : '-'),
        "Check In": reservation?.checkIn != null ? moment(reservation?.checkIn).format('MMM DD, YYYY') : '-',
        "Check Out": reservation?.checkOut != null ? moment(reservation?.checkOut).format('MMM DD, YYYY') : '-',
        "Currency": toCurrency,
        "Total Amount": total > 0 ? (convert(base?.symbol, rates, total, currency, toCurrency)).toFixed(2) : (total ? total : '-'),
        "Confirmation Code": reservation?.confirmationCode,
        "Title": reservation?.title ? reservation?.title : '-',
        "First Name": reservation?.firstName ? reservation?.firstName : '-'
    };
}

const getGrossResult = ({ base, rates, reservation, toCurrency }) => {
    let amount = reservation['cancellationDetails.payoutToHost'] || reservation['cancellationDetails.payoutToHost'] == 0 ? reservation['cancellationDetails.payoutToHost'] : (reservation?.total - reservation?.hostServiceFee);
    let currency = reservation.currency;
    if (reservation.reservationState == 'cancelled'){
        currency = reservation['cancellationDetails.currency'];
    } 
    if (reservation.reservationState == 'cancelled') amount = reservation['cancellationDetails.payoutToHost'];
    return {
        "Date": reservation['transactionHistory.createdAt'] ? moment(reservation['transactionHistory.createdAt']).format('DD-MM-YYYY') : 'Pending',
        "Check In": reservation?.checkIn != null ? moment(reservation?.checkIn).format('MMM DD, YYYY') : '-',
        "Check Out": reservation?.checkOut != null ? moment(reservation?.checkOut).format('MMM DD, YYYY') : '-',
        "Currency": toCurrency,
        "Amount": amount > 0 ? (convert(base?.symbol, rates, amount, currency, toCurrency)).toFixed(2) : (amount ? amount : '-'),
        "Confirmation Code": reservation?.confirmationCode
    };
}

const getFutureResult = ({ base, rates, reservation, toCurrency }) => {
    let amount = Number(reservation?.total) - Number(reservation?.hostServiceFee);
    if (reservation?.reservationState == 'cancelled') amount = reservation['cancellationDetails.payoutToHost'];
    return {
        "Date": reservation?.checkIn ? moment(reservation?.checkIn).add(1, 'days').format('DD-MM-YYYY') : 'Pending',
        "Check In": reservation?.checkIn != null ? moment(reservation?.checkIn).format('MMM DD, YYYY') : '-',
        "Check Out": reservation?.checkOut != null ? moment(reservation?.checkOut).format('MMM DD, YYYY') : '-',
        "Currency": toCurrency,
        "Amount": amount > 0 ? (convert(base?.symbol, rates, amount, reservation.currency, toCurrency)).toFixed(2) : (amount ? amount : '-'),
        "Payout Account": reservation?.payoutAccount ? reservation?.payoutAccount : "Default",
        "Title": reservation?.title ? reservation?.title : '-',
        "First Name": reservation?.firstName ? reservation?.firstName : '-',
        "Confirmation Code": reservation?.confirmationCode
    };
}

export {
    getCompletedResult,
    getGrossResult,
    getFutureResult
};