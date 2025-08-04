import moment from 'moment';
import showToaster from '../../helpers/toasterMessages/showToaster';
import { sendPayment } from '../../core/payment/sendPayment';
import { convert } from '../../helpers/currencyConvertion';
import { processStripePayment } from '../../core/payment/stripe/processStripePayment';
import { startTimeData } from '../../helpers/formatting';
import { createReservation as mutation } from '../../lib/graphql/booking';
import { createReservationThread } from '../../lib/graphql/message';
import {
  BOOKING_PAYMENT_START,
  BOOKING_PAYMENT_SUCCESS,
  BOOKING_PAYMENT_ERROR,
} from '../../constants';

export const makePayment = (
  listId,
  title,
  hostId,
  guestId,
  checkIn,
  checkOut,
  guests,
  message,
  basePrice,
  delivery,
  currency,
  discount,
  discountType,
  guestServiceFee,
  hostServiceFee,
  total,
  bookingType,
  paymentCurrency,
  paymentType,
  guestEmail,
  specialPricing,
  isSpecialPriceAssigned,
  isSpecialPriceAverage,
  dayDifference,
  startTime,
  endTime,
  licenseNumber,
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  countryCode,
  paymentMethodId,
  securityDeposit,
  hostServiceFeeType,
  hostServiceFeeValue,
  fullTotal,
  megasoftVoucher,
  isHourly
) => {

  return async (dispatch, getState, { client }) => {
    try {
      // Log the incoming checkIn and checkOut arguments
      console.log('makePayment.js - Incoming checkIn:', checkIn, 'Type:', typeof checkIn);
      console.log('makePayment.js - Incoming checkOut:', checkOut, 'Type:', typeof checkOut);

      dispatch({
        type: BOOKING_PAYMENT_START,
        payload: {
          paymentLoading: true
        }
      });

      let preApprove, bookingTypeData, cancellationPolicy, isStartValue, isStartDate, checkInDate, checkOutDate, isEndDate, isEndValue;
      let securityDepositStatus, securityDepositAmount;
      preApprove = getState().book?.bookDetails?.preApprove;
      bookingTypeData = preApprove ? 'instant' : bookingType;
      cancellationPolicy = getState().book?.data?.listingData?.cancellation?.id;
      // Log startTime and endTime
      console.log('makePayment.js - startTime:', startTime, 'endTime:', endTime);
      isStartValue = startTimeData(startTime) || '00:00', isEndValue = startTimeData(endTime) || '00:00';
      isStartDate = moment(checkIn).format('YYYY-MM-DD'), isEndDate = moment(checkOut).format('YYYY-MM-DD');
      checkInDate = moment.utc(isStartDate + ' ' + isStartValue), checkOutDate = moment.utc(isEndDate + ' ' + isEndValue);
      // Log the computed checkInDate and checkOutDate
      console.log('makePayment.js - Computed checkInDate:', checkInDate.toISOString(), 'from', isStartDate, isStartValue);
      console.log('makePayment.js - Computed checkOutDate:', checkOutDate.toISOString(), 'from', isEndDate, isEndValue);
      securityDepositStatus = getState().siteSettings?.data?.securityDepositPreference;
      securityDepositAmount = securityDepositStatus == 1 ? securityDeposit : 0


      const { data } = await client.mutate({
        mutation,
        variables: {
          listId,
          hostId,
          guestId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          message,
          basePrice,
          delivery,
          currency,
          discount,
          discountType,
          guestServiceFee,
          hostServiceFee,
          total,
          bookingType: bookingTypeData,
          paymentType,
          cancellationPolicy,
          specialPricing,
          isSpecialPriceAssigned,
          isSpecialPriceAverage,
          dayDifference,
          startTime,
          endTime,
          licenseNumber,
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          countryCode,
          securityDeposit: securityDepositAmount,
          hostServiceFeeType,
          hostServiceFeeValue,
          megasoftVoucher,
          isHourly
        }
      })

      if (data?.createReservation) {
        let reservationId, amount, rates, baseCurrency, convertedAmount = 0, reservationDetails;
        reservationId = data?.createReservation?.id;
        amount = typeof fullTotal !== 'undefined' ? fullTotal : (total + guestServiceFee + securityDepositAmount);

        rates = getState().currency?.rates;
        baseCurrency = getState().currency?.base;

        // Handle Megasoft payment types (3, 4, 5, 6, 7) - only create reservation, no payment processing
        if (paymentType >= 3 && paymentType <= 7) {
          // Create message thread for the reservation
          try {
            await client.mutate({
              mutation: createReservationThread,
              variables: {
                reservationId
              }
            });
          } catch (threadError) {
            console.warn('Failed to create message thread:', threadError);
            // Continue even if thread creation fails
          }

          dispatch({
            type: BOOKING_PAYMENT_SUCCESS,
            payload: { paymentLoading: false }
          });
          return {
            status: 200,
            reservationId
          };
        }

        if (paymentType == 1) {
          convertedAmount = convert(baseCurrency, rates, amount, currency, paymentCurrency);
          const { status, errorMessage } = await sendPayment(reservationId, convertedAmount.toFixed(2), paymentCurrency, title);
          if (status == 200) {
            dispatch({
              type: BOOKING_PAYMENT_SUCCESS,
              payload: { paymentLoading: false }
            });
          } else {
            if (status == 422) {
              showToaster({ messageId: 'invalidCurrency', toasterType: 'error' })
            }
            else {
              errorMessage ? showToaster({ messageId: 'checkStatus', toasterType: 'error', requestMessage: errorMessage }) : '';
            }
            dispatch({
              type: BOOKING_PAYMENT_ERROR,
              payload: { paymentLoading: false }
            });
          }

        } else {
          reservationDetails = {
            reservationId,
            listId,
            hostId,
            guestId,
            guestEmail,
            title,
            amount,
            currency
          };

          const { status, errorMessage, paymentIntentSecret } = await processStripePayment(
            'reservation',
            null,
            reservationDetails,
            paymentMethodId
          );

          if (status === 200) {
            dispatch({
              type: BOOKING_PAYMENT_SUCCESS,
              payload: { paymentLoading: true }
            });

            return {
              status
            }
          } else {
            errorMessage ? showToaster({ messageId: 'failedError', toasterType: 'error', requestMessage: errorMessage }) : '';
            dispatch({
              type: BOOKING_PAYMENT_ERROR,
              payload: { paymentLoading: false }
            });

            return {
              status,
              paymentIntentSecret,
              reservationId
            }
          }
        }
      }
    } catch (error) {
      dispatch({
        type: BOOKING_PAYMENT_ERROR,
        payload: {
          error,
          paymentLoading: false
        }
      });
      return false;
    }

    return true;
  };
}