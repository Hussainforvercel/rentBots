import { gql } from 'react-apollo';

export const addPayout = gql`
    mutation addPayout(
      $methodId: Int!, 
      $payEmail: String!,
      $address1: String,
      $address2: String,
      $city: String!,
      $state: String!,
      $country: String!,
      $zipcode: String!,
      $currency: String!,
      $last4Digits: Int,
      $isVerified: Boolean
    ){
        addPayout(
          methodId: $methodId,
          payEmail: $payEmail,
          address1: $address1,
          address2: $address2,
          city: $city,
          state: $state,
          country: $country,
          zipcode: $zipcode,
          currency: $currency,
          last4Digits: $last4Digits,
          isVerified: $isVerified
        ) {
            id
            methodId
            userId
            payEmail
            last4Digits
            address1
            address2
            city
            state
            country
            zipcode
            currency
            createdAt
            status
        }
    }
    `;

export const getPayoutsQuery = gql`query getPayouts($currentAccountId: String, $userId: String) {
    getPayouts(currentAccountId: $currentAccountId, userId: $userId) {
      id
      methodId
      paymentMethod{
        id
        name
      }
      userId
      payEmail
      address1
      address2
      city
      state
      country
      zipcode
      currency
      default
      createdAt
      status
      last4Digits
      isVerified
    }
  }`;

export const removePayout = gql`
    mutation removePayout(
      $id: Int!, 
    ){
        removePayout(
          id: $id
        ) {
            status
        }
    }
    `;

export const setDefaultPayout = gql`
    mutation setDefaultPayout(
      $id: Int!, 
    ){
        setDefaultPayout(
          id: $id
        ) {
            status
        }
    }
    `;

export const updatePayoutForReservation = gql`
    mutation updatePayoutForReservation(
      $payoutId: Int!, 
      $reservationId: Int!
     ){
        updatePayoutForReservation(
          payoutId: $payoutId,
          reservationId: $reservationId
        ) {
            status
        }
     }
    `;

export const updatePayoutStatus = gql`
    mutation updatePayoutStatus ($id: Int!, $isHold: Boolean!){
        updatePayoutStatus(id: $id, isHold: $isHold){
            status
            errorMessage
        }
      }
    `;
