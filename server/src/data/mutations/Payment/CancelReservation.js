import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import moment from 'moment';
// import {
//   Reservation, Listing, ListBlockedDates, CancellationDetails, Threads, ThreadItems
// } from '../../models';
import Reservation from '../../models/Reservation.js';
import Listing from '../../models/Listing.js';
import  ListBlockedDates  from '../../models/ListBlockedDates.js';
import CancellationDetails from '../../models/CancellationDetails.js';
import Threads from '../../models/Threads.js';
import ThreadItems from '../../models/ThreadItems.js';
import ReservationCommonType from '../../types/ReservationCommonType.js';
import checkUserBanStatus from '../../../libs/checkUserBanStatus.js';
import { sendNotifications } from '../../../helpers/sendNotifications.js';
import { sendEmail } from '../../../libs/sendEmail.js';
import showErrorMessage from '../../../helpers/showErrorMessage.js';
import { momentFormat } from '../../../helpers/momentHelper.js';
import getCurrencyRates from '../../../helpers/currencyRatesHelper.js';
import { getUser } from '../../../helpers/getUserData.js';
import { convert } from '../../../helpers/currencyConvertion.js';

const CancelReservation = {
  type: ReservationCommonType,
  args: {
    reservationId: { type: new NonNull(IntType) },
    cancellationPolicy: { type: new NonNull(StringType) },
    refundToGuest: { type: new NonNull(FloatType) },
    payoutToHost: { type: new NonNull(FloatType) },
    guestServiceFee: { type: new NonNull(FloatType) },
    hostServiceFee: { type: new NonNull(FloatType) },
    total: { type: new NonNull(FloatType) },
    currency: { type: new NonNull(StringType) },
    threadId: { type: new NonNull(IntType) },
    cancelledBy: { type: new NonNull(StringType) },
    message: { type: new NonNull(StringType) },
    checkIn: { type: new NonNull(StringType) },
    checkOut: { type: new NonNull(StringType) },
    guests: { type: new NonNull(IntType) },
    startTime: { type: new NonNull(FloatType) },
    endTime: { type: new NonNull(FloatType) }
  },
  async resolve({ request, response }, {
    reservationId,
    cancellationPolicy,
    refundToGuest,
    payoutToHost,
    guestServiceFee,
    hostServiceFee,
    total,
    currency,
    threadId,
    cancelledBy,
    message,
    checkIn,
    checkOut,
    guests,
    startTime,
    endTime
  }) {

    try {

      if (!request.user) {
        return {
          errorMessage: await showErrorMessage({errorCode: 'loginError' }),
          status: 500
        };
      }

      const { userStatusErrorMessage, userStatusError } = await checkUserBanStatus(request.user.id); // Check user ban or deleted status
      if (userStatusErrorMessage) {
        return {
          status: userStatusError,
          errorMessage: userStatusErrorMessage
        };
      }

      const userId = request.user.id;
      let toEmail, emailContent = {}, emailType, notifyUserId, notifyUserType, notifyContent;
      let userName, messageContent, today, startInDate, endInDate, isClaimCancelStatus;
      let convertRefundToGuest = refundToGuest || 0, convertPayoutToHost = payoutToHost || 0;
      let convertGuestServiceFee = guestServiceFee || 0, convertHostServiceFee = hostServiceFee || 0, convertTotal = total || 0;
      today = momentFormat(undefined, 'YYYY-MM-DD');
      startInDate = momentFormat(checkIn, 'YYYY-MM-DD');
      endInDate = momentFormat(checkOut, 'YYYY-MM-DD');
      isClaimCancelStatus = moment(today).isBetween(startInDate, endInDate, undefined, '[]')

      const reservationData = await Reservation.findOne({
        attributes: ['id', 'confirmationCode', 'reservationState', 'currency'],
        where: { id: reservationId },
        raw: true
      });

      if (!reservationData) {
        return {
          status: 400,
          errorMessage: await showErrorMessage({errorCode: 'noReservation' }),
        };
      }

      if (reservationData.reservationState == 'cancelled') {
        return {
          status: 400,
          errorMessage: await showErrorMessage({errorCode: 'reservationCancelled' }),
        };
      }

      const getThread = await Threads.findOne({
        where: { id: threadId },
        raw: true
      });

      if (getThread && getThread.host && getThread.guest) {
        notifyUserId = getThread.host === userId ? getThread.guest : getThread.host;
        notifyUserType = getThread.host === userId ? 'renter' : 'owner';
      }

      const hostDetails = await getUser({ userId: getThread.host, attributes: ['email'], profileAttributes: ['firstName', 'displayName'] });
      const guestDetails = await getUser({ userId: getThread.guest, attributes: ['email'], profileAttributes: ['firstName', 'displayName'] });
      if (hostDetails && guestDetails && getThread) {
        userName = getThread.host === userId ? (hostDetails['profile.displayName']) : (guestDetails['profile.displayName']);
      }

      const listingData = await Listing.findOne({
        attributes: ['id', 'title'],
        where: { id: getThread.listId },
        raw: true
      });

      await Reservation.update({
        reservationState: 'cancelled',
        isClaimCancelStatus
      }, { where: { id: reservationId } });

      if (cancelledBy === 'renter') {

        await ListBlockedDates.update({
          reservationId: null,
          calendarStatus: 'available'
        }, {
          where: {
            reservationId,
            calendarStatus: 'blocked',
            isSpecialPrice: {
              $ne: null
            }
          }
        });

        await ListBlockedDates.destroy({
          where: {
            reservationId,
            calendarStatus: 'blocked',
            isSpecialPrice: {
              $eq: null
            }
          }
        });

      }

      toEmail = cancelledBy === 'renter' ? hostDetails.email : guestDetails.email;
      const { base, rates } = await getCurrencyRates();
      const convertCurrency = reservationData.currency;
      if (currency != convertCurrency) {
        convertRefundToGuest = convert(base, rates, convertRefundToGuest, currency, convertCurrency).toFixed(2);
        convertPayoutToHost = convert(base, rates, convertPayoutToHost, currency, convertCurrency).toFixed(2);
        convertGuestServiceFee = convert(base, rates, convertGuestServiceFee, currency, convertCurrency).toFixed(2);
        convertHostServiceFee = convert(base, rates, convertHostServiceFee, currency, convertCurrency).toFixed(2);
        convertTotal = convert(base, rates, convertTotal, currency, convertCurrency).toFixed(2);
      }

      emailContent = {
        hostName: hostDetails['profile.firstName'],
        guestName: guestDetails['profile.firstName'],
        confirmationCode: reservationData.confirmationCode,
        checkIn,
        listTitle: listingData.title,
        payoutToHost: convertPayoutToHost,
        refundToGuest: convertRefundToGuest,
        currency: convertCurrency
      };

      await CancellationDetails.create({
        reservationId,
        cancellationPolicy,
        refundToGuest: convertRefundToGuest,
        payoutToHost: convertPayoutToHost,
        guestServiceFee: convertGuestServiceFee,
        hostServiceFee: convertHostServiceFee,
        total: convertTotal,
        currency: convertCurrency,
        cancelledBy: cancelledBy === 'owner' ? 'host' : 'guest'
      });

      await ThreadItems.create({
        threadId,
        reservationId,
        sentBy: userId,
        content: message,
        type: cancelledBy === 'owner' ? 'cancelledByHost' : 'cancelledByGuest',
        startDate: checkIn,
        endDate: checkOut,
        personCapacity: guests,
        startTime,
        endTime
      });
      messageContent = userName + ': ' + message;
      await Threads.update({
        isRead: false,
        messageUpdatedDate: new Date()
      }, { where: { id: threadId } });

      notifyContent = {
        "screenType": "trips",
        "title": 'Booking is cancelled',
        "userType": notifyUserType.toString(),
        "message": messageContent.toString()
      };
      emailType = cancelledBy === 'owner' ? 'cancelledByHost' : 'cancelledByGuest';
      sendNotifications(notifyContent, notifyUserId);
      sendEmail(toEmail, emailType, emailContent);

      return {
        status: 200
      }

    } catch (error) {
      return {
        errorMessage: await showErrorMessage({errorCode: 'catchError', error }),
        status: 400
      };
    }
  },
};

export default CancelReservation;