import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
  GraphQLBoolean as BooleanType,
} from "graphql";
// import {
//   Reservation,
//   ListingData,
//   Listing,
//   ReservationSpecialPricing,
// } from "../../models";
import Reservation from "../../models/Reservation.js";
import ListingData from "../../models/ListingData.js";
import Listing from "../../models/Listing.js";
import ReservationSpecialPricing from "../../models/ReservationSpecialPricing.js";
import ReservationPaymentType from "../../types/ReservationPaymentType.js";
import { convert } from "../../../helpers/currencyConvertion.js";
import {
  createCustomer,
  createStripePayment,
} from "../../../libs/payment/stripe/helpers/stripe.js";
import { createPayPalPayment } from "../../../libs/payment/paypal/createPayPalPayment.js";
import checkUserBanStatus from "../../../libs/checkUserBanStatus.js";
import { momentUtcHelper } from "../../../helpers/momentHelper.js";
import showErrorMessage from "../../../helpers/showErrorMessage.js";
import dayDifferenceHelper from "../../../helpers/dayDifferenceHelper.js";
import getCurrencyRates from "../../../helpers/currencyRatesHelper.js";
import getBillingDetails from "./getBillingDetails.js";

const createReservation = {
  type: ReservationPaymentType,
  args: {
    listId: { type: new NonNull(IntType) },
    checkIn: { type: new NonNull(StringType) },
    checkOut: { type: new NonNull(StringType) },
    guests: { type: new NonNull(IntType) },
    message: { type: new NonNull(StringType) },
    basePrice: { type: new NonNull(FloatType) },
    delivery: { type: FloatType },
    currency: { type: new NonNull(StringType) },
    discount: { type: FloatType },
    discountType: { type: StringType },
    guestServiceFee: { type: FloatType },
    hostServiceFee: { type: FloatType },
    total: { type: new NonNull(FloatType) },
    bookingType: { type: StringType },
    paymentType: { type: IntType },
    cardToken: { type: StringType },
    averagePrice: { type: FloatType },
    days: { type: IntType },
    startTime: { type: FloatType },
    endTime: { type: FloatType },
    licenseNumber: { type: new NonNull(StringType) },
    firstName: { type: new NonNull(StringType) },
    middleName: { type: StringType },
    lastName: { type: new NonNull(StringType) },
    dateOfBirth: { type: new NonNull(StringType) },
    countryCode: { type: StringType },
    isDeliveryIncluded: { type: BooleanType },
    paymentCurrency: { type: StringType },
  },
  async resolve(
    { request, res },
    {
      listId,
      checkIn,
      checkOut,
      guests,
      message,
      basePrice,
      currency,
      discount,
      discountType,
      guestServiceFee,
      hostServiceFee,
      total,
      bookingType,
      paymentType,
      cardToken,
      averagePrice,
      days,
      startTime,
      endTime,
      licenseNumber,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      countryCode,
      isDeliveryIncluded,
      paymentCurrency,
    }
  ) {
    try {
      if (!request.user) {
        return {
          status: 500,
          errorMessage: await showErrorMessage({ errorCode: "loginAccount" }),
        };
      }

      const { userStatusErrorMessage, userStatusError } =
        await checkUserBanStatus(request.user.id); // Check user ban or deleted status
      if (userStatusErrorMessage) {
        return {
          status: userStatusError,
          errorMessage: userStatusErrorMessage,
        };
      }

      let userId = request.user.id,
        status = 200,
        errorMessage,
        reservationId,
        amount;
      let confirmationCode = Math.floor(100000 + Math.random() * 900000),
        totalWithoutGuestFeeConverted = 0;
      let reservationState,
        hostId,
        reservation,
        totalConverted = 0;
      let discountConverted = 0,
        guestServiceFeeConverted = 0,
        hostServiceFeeConverted = 0;
      let convertSpecialPricing = [],
        averagePriceConverted = 0,
        specialPriceCollection = [];
      let listingBasePrice = 0,
        listingDeliveryPrice = 0,
        securityDeposit = 0,
        paymentIntentId;
      let isSpecialPriceAssigned = false,
        hostServiceFeeType,
        hostServiceFeeValue;
      let customerId,
        customerEmail,
        paymentIntentSecret,
        requireAdditionalAction = false,
        redirectUrl,
        dayDiff;
      if (bookingType === "instant") reservationState = "approved";

      const listData = await Listing.findOne({
        attributes: ["userId", "title"],
        where: {
          id: listId,
        },
        raw: true,
      });
      if (!listData) {
        return {
          errorMessage: await showErrorMessage({ errorCode: "invalidListId" }),
          status: 400,
        };
      }
      hostId = listData.userId;
      const listingData = await ListingData.findOne({
        attributes: [
          "basePrice",
          "currency",
          "cancellationPolicy",
          "delivery",
          "securityDeposit",
        ],
        where: {
          listId,
        },
        raw: true,
      });
      if (listingData) {
        listingBasePrice = listingData.basePrice;
        listingDeliveryPrice = isDeliveryIncluded ? listingData.delivery : 0;
        securityDeposit = listingData.securityDeposit;
      }
      // conversion data
      discountConverted = discount;
      guestServiceFeeConverted = guestServiceFee;
      hostServiceFeeConverted = hostServiceFee;
      totalConverted = total;
      averagePriceConverted = averagePrice;

      const { base, rates } = await getCurrencyRates();

      if (currency != listingData.currency) {
        discountConverted = convert(
          base,
          rates,
          discount,
          currency,
          listingData.currency
        );
        guestServiceFeeConverted = convert(
          base,
          rates,
          guestServiceFee,
          currency,
          listingData.currency
        );
        hostServiceFeeConverted = convert(
          base,
          rates,
          hostServiceFee,
          currency,
          listingData.currency
        );
        totalConverted = convert(
          base,
          rates,
          total,
          currency,
          listingData.currency
        );
        averagePriceConverted = convert(
          base,
          rates,
          averagePrice,
          currency,
          listingData.currency
        );
      }

      dayDiff = dayDifferenceHelper({
        startDate: checkIn,
        endDate: checkOut,
        startTime,
        endTime,
      });
      const variables = {
        listId,
        startDate: new Date(checkIn),
        endDate: new Date(checkOut),
        guests,
        convertCurrency: currency,
        startTime,
        endTime,
        isDeliveryIncluded,
      };
      const response = await getBillingDetails(variables);
      if (
        response &&
        response.data &&
        response.data.getBillingCalculation &&
        response.data.getBillingCalculation.result
      ) {
        isSpecialPriceAssigned =
          response.data.getBillingCalculation.result.isSpecialPriceAssigned;
        hostServiceFeeType =
          response.data.getBillingCalculation.result.hostServiceFeeType;
        hostServiceFeeValue =
          response.data.getBillingCalculation.result.hostServiceFeeValue;
        securityDeposit =
          response.data.getBillingCalculation.result.securityDeposit > 0
            ? securityDeposit
            : 0;
        if (isSpecialPriceAssigned) {
          convertSpecialPricing =
            response.data.getBillingCalculation.result.specialPricing;
        }
        if (total != response.data.getBillingCalculation.result.total) {
          return {
            errorMessage: response.data.getBillingCalculation.errorMessage,
            status: 400,
          };
        }
      }

      totalWithoutGuestFeeConverted =
        totalConverted - guestServiceFeeConverted - securityDeposit;
      amount = totalConverted;
      if (paymentType === 2 && status === 200) {
        const stripeCustomerData = await createCustomer(userId);
        status = stripeCustomerData.status;
        errorMessage = stripeCustomerData.errorMessage;
        customerId = stripeCustomerData.customerId;
        customerEmail = stripeCustomerData.customerEmail;
      }
      if (status === 200) {
        reservation = await Reservation.create({
          listId,
          hostId,
          guestId: userId,
          checkIn: momentUtcHelper(
            response.data.getBillingCalculation.result.checkIn
          ),
          checkOut: momentUtcHelper(
            response.data.getBillingCalculation.result.checkOut
          ),
          guests,
          message,
          basePrice: listingBasePrice,
          delivery: listingDeliveryPrice,
          currency: listingData.currency,
          discount: discountConverted.toFixed(2),
          discountType,
          guestServiceFee: guestServiceFeeConverted.toFixed(2),
          hostServiceFee: hostServiceFeeConverted.toFixed(2),
          total: totalWithoutGuestFeeConverted.toFixed(2),
          confirmationCode,
          reservationState,
          paymentMethodId: paymentType,
          cancellationPolicy: listingData.cancellationPolicy,
          isSpecialPriceAverage: averagePriceConverted.toFixed(2),
          dayDifference: dayDiff.dayDifference,
          startTime,
          endTime,
          licenseNumber,
          firstName,
          middleName,
          lastName,
          dateOfBirth,
          countryCode,
          securityDeposit,
          listTitle: listData.title,
          hostServiceFeeType,
          hostServiceFeeValue,
          bookingType,
        });

        reservationId = reservation.dataValues.id;

        if (reservation && isSpecialPriceAssigned) {
          if (convertSpecialPricing && convertSpecialPricing.length > 0) {
            await Promise.all(
              convertSpecialPricing.map(async (item, key) => {
                const blockedDatesInstance = {
                  listId,
                  reservationId: reservationId,
                  blockedDates: new Date(parseInt(item.blockedDates)),
                  isSpecialPrice: item.isSpecialPrice,
                };
                specialPriceCollection.push(blockedDatesInstance);
              })
            );
            await ReservationSpecialPricing.bulkCreate(specialPriceCollection);
          }
        }

        if (paymentType === 2) {
          //  Create stripe paymentIntents
          const stripePaymentData = await createStripePayment(
            cardToken,
            amount,
            listingData.currency,
            customerId,
            customerEmail,
            reservationId,
            listId,
            listData.title
          );
          status = stripePaymentData.status;
          errorMessage = stripePaymentData.errorMessage;
          requireAdditionalAction = stripePaymentData.requireAdditionalAction;
          paymentIntentSecret = stripePaymentData.paymentIntentSecret;
        } else {
          let paypalPayAmount = convert(
            base,
            rates,
            amount,
            listingData.currency,
            paymentCurrency
          ).toFixed(2);
          //  Create paypal payment
          const paypalPayment = await createPayPalPayment(
            reservationId,
            paypalPayAmount,
            paymentCurrency
          );
          status = paypalPayment.status;
          errorMessage = paypalPayment.errorMessage;
          redirectUrl =
            paypalPayment.data &&
            paypalPayment.data.links.find((link) => link.rel === "payer-action")
              .href;
        }
      }

      return {
        results: reservation,
        status,
        errorMessage,
        requireAdditionalAction,
        paymentIntentSecret,
        paymentIntentId,
        reservationId,
        redirectUrl,
      };
    } catch (error) {
      return {
        errorMessage: await showErrorMessage({ errorCode: "catchError", error }),
        status: 400,
      };
    }
  },
};

export default createReservation;
