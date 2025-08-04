import { gql } from 'react-apollo';

export const userListing = gql`
    query UserListing($listId:String!) {
      UserListing (listId:$listId) {
        id
        userId
        title
        coverPhoto
        country
        city
        state
        personCapacity
        bookingType
        transmission
        reviewsCount
        reviewsStarRating
        listPhotos{
          id
          name
        }
        user {
          email
          profile{
            profileId
            displayName
            firstName
            picture
            createdAt
          }
        }
        settingsData {
          id
          settingsId
          listsettings {
            id
            itemName
            settingsType {
              typeName
            }
          }
        }
        houseRules {
          houseRulesId
          listsettings{
            itemName
            isEnable
            settingsType {
              typeName
            }
          }
        }
        listingData {
          checkInStart,
          checkInEnd,
          basePrice,
          hourlyPrice,
          delivery,
          currency,
          weeklyDiscount,
          monthlyDiscount,
          securityDeposit
          cancellation {
            id
            policyName
            policyContent
          }
        }
        listBlockedPrice {
          id
          listId
          isSpecialPrice
          blockedDates
        }
      }
    }`;

export const createReservation = gql`
    mutation createReservation(
      $listId: Int!, 
      $hostId: String!,
      $guestId: String!,
      $checkIn: String!,
      $checkOut: String!,
      $guests: Int!,
      $message: String!,
      $basePrice: Float!,
      $delivery: Float,
      $currency: String!,
      $discount: Float,
      $discountType: String,
      $guestServiceFee: Float,
      $hostServiceFee: Float,
      $total: Float!,
      $bookingType: String,
      $paymentType: Int!,
      $cancellationPolicy: Int!,
      $specialPricing: String,
      $isSpecialPriceAssigned: Boolean,
      $isSpecialPriceAverage: Float,
      $dayDifference: Float,
      $startTime: Float,
      $endTime: Float,
      $licenseNumber: String!,
      $firstName: String!,
      $middleName: String,
      $lastName: String!,
      $dateOfBirth: String!,
      $countryCode: String,
      $securityDeposit: Float,
      $hostServiceFeeType: String,
      $hostServiceFeeValue: Float,
      $megasoftVoucher: String,
      $isHourly: Boolean
    ){
        createReservation(
          listId: $listId,
          hostId: $hostId,
          guestId: $guestId,
          checkIn: $checkIn,
          checkOut: $checkOut,
          guests: $guests,
          message: $message,
          basePrice: $basePrice,
          delivery: $delivery,
          currency: $currency,
          discount: $discount,
          discountType: $discountType,
          guestServiceFee: $guestServiceFee,
          hostServiceFee: $hostServiceFee,
          total: $total,
          bookingType: $bookingType,
          paymentType: $paymentType,
          cancellationPolicy: $cancellationPolicy,
          specialPricing: $specialPricing,
          isSpecialPriceAssigned: $isSpecialPriceAssigned,
          isSpecialPriceAverage: $isSpecialPriceAverage,
          dayDifference: $dayDifference,
          startTime: $startTime,
          endTime: $endTime,
          licenseNumber: $licenseNumber,
          firstName: $firstName,
          middleName: $middleName,
          lastName: $lastName,
          dateOfBirth: $dateOfBirth,
          countryCode: $countryCode,
          securityDeposit: $securityDeposit,
          hostServiceFeeType: $hostServiceFeeType,
          hostServiceFeeValue: $hostServiceFeeValue,
          megasoftVoucher: $megasoftVoucher,
          isHourly: $isHourly
        ) {
            id
            listId,
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
            confirmationCode,
            createdAt
            status
            paymentMethodId,
            cancellationPolicy,
            isSpecialPriceAverage,
            dayDifference
        }
    }
    `;

export const getPaymentState = gql`
    query getPaymentState($reservationId: Int!){
      getPaymentState(reservationId: $reservationId){
        paymentState
      }
    }
    `;

export const updateReservationPaymentState = gql`
    mutation updateReservationPaymentState($reservationId: Int!) {
      updateReservationPaymentState(reservationId: $reservationId) {
        status
      }
    }
    `;

export const cancelReservation = gql`
    mutation cancelReservation(
    $reservationId: Int!,
    $cancellationPolicy: String!,
    $refundToGuest: Float!,
    $payoutToHost: Float!,
    $guestServiceFee: Float!,
    $hostServiceFee: Float!,
    $total: Float!,
    $currency: String!,
    $threadId: Int!,
    $cancelledBy: String!,
    $message: String!,
    $checkIn: String!,
      $checkOut: String!,
      $guests: Int!,
      $startTime: Float!,
      $endTime: Float!
    ){
    cancelReservation(
      reservationId: $reservationId,
      cancellationPolicy: $cancellationPolicy,
      refundToGuest: $refundToGuest,
      payoutToHost: $payoutToHost,
      guestServiceFee: $guestServiceFee,
      hostServiceFee: $hostServiceFee,
      total: $total,
      currency: $currency,
      threadId: $threadId,
      cancelledBy: $cancelledBy,
      message: $message,
      checkIn: $checkIn,
      checkOut: $checkOut,
      guests: $guests,
      startTime: $startTime,
      endTime: $endTime
    ) {
        status
    }
    }
    `;

export const updateReservation = gql`
    mutation updateReservation(
      $reservationId: Int!, 
      $actionType: String!,
      $threadId: Int
    ){
        updateReservation(
          reservationId: $reservationId,
          actionType: $actionType,
          threadId: $threadId
        ) {
            status
        }
    }
    `;

export const reservationQuery = gql`
    query getReservationData ($reservationId: Int!){
      getItinerary(reservationId: $reservationId){
        id
        confirmationCode
        checkIn
        listData {
          id
          title
          city
        }
        hostData {
          firstName
          userData {
            email
          }
        }
        guestData {
          firstName
          userData {
            email
          }
        }
        messageData {
          id
        }
        reservationState
      }
    }
    `;