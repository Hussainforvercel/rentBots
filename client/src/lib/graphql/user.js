import { gql } from 'react-apollo';

export const userLogout = gql`
    query {
      userLogout {
          status
      }
    }
    `;

export const userAccount = `
    query userAccount{
      userAccount {
        userId
        profileId
        firstName
        lastName
        displayName
        gender
        dateOfBirth
        email
        userBanStatus
        phoneNumber
        preferredLanguage
        preferredCurrency
        location
        info
        createdAt
        picture
        country
        countryCode
        countryName
        verification {
          id
          isEmailConfirmed
          isFacebookConnected
          isGoogleConnected
          isIdVerification
          isPhoneVerified
        }
        userData {
          type
        }
      }
    }
    `;

export const dateAvailability = gql`
    query ($listId:Int!,  $startDate: String!, $endDate: String!) {
      DateAvailability (listId:$listId, startDate:$startDate, endDate: $endDate) {
        status
      }
      }
    `;

export const deleteUser = gql`
    mutation deleteUser ($userId:String!) {
        deleteUser (userId:$userId) {
          status
          errorMessage
        }
      }
    `;
