import { gql } from 'react-apollo';

export const sendForgotPassword = gql`
    mutation sendForgotPassword($email: String!) {
      sendForgotPassword (email: $email) {
        id
        email
        token
        userId
        status
        profile {
          firstName
        }
      }
    }
    `;

export const changeForgotPassword = gql`
    mutation changeForgotPassword($email: String!, $newPassword: String!) {
     changeForgotPassword (email: $email, newPassword: $newPassword) {
       status
     }
    }
    `;

export const getHomeData = gql`{
  getHomeData {
    result {
      id
      title
      content
      getFindYouCar{
        id
        name
        value
      }
      getBanner{
        image
      }
    }
  }
  }
  `;

export const getServiceFees = gql`
    query getServiceFees{
      getServiceFees{
          id
          guestType
          guestValue
          hostType
          hostValue
          currency
          status
      }
    }
    `;

export const updateServiceFees = gql`
    mutation updateServiceFees(
      $guestType: String!, 
      $guestValue: Float!,
      $hostType: String!,
      $hostValue: Float!,
      $currency: String,
    ){
        updateServiceFees(
          guestType: $guestType,
          guestValue: $guestValue,
          hostType: $hostType,
          hostValue: $hostValue,
          currency: $currency
        ) {
            id
            guestType
            guestValue
            hostType
            hostValue
            currency
            status
        }
    }
    `;

export const adminUserLogout = gql`
    query {
        adminUserLogout {
            status
        }
      }
    `;

export const userManagement = gql`
    query userManagement($currentPage: Int, $searchList: String){
        userManagement(currentPage: $currentPage, searchList: $searchList) {
          count
          usersData{
            id,
              email,
              profile
              {
              profileId,
              firstName,
              lastName,
              gender,
              dateOfBirth,
              phoneNumber,
              preferredLanguage,
              preferredCurrency,
              location,
              info,
              createdAt
              },
              userBanStatus,
          }
         }
      }
    `;

export const updateBanServiceHistoryStatus = gql`
    mutation($id: String, $banStatus: Int) {
      updateBanServiceHistoryStatus(id: $id ,banStatus: $banStatus){
        status
        }
      }
    `;

export const getAllPaymentMethods = gql`
    query getAllPaymentMethods {
        getAllPaymentMethods {
            id
            name
            paymentName
            processedIn
            fees
            currency
            details
            isEnable
            paymentType
            createdAt
            updatedAt
            status
        }
    }
    `;

export const updatePaymentGateWayStatus = gql`
    mutation updatePaymentGateWayStatus ($id: Int!, $isEnable: Boolean!) {
        updatePaymentGatewayStatus(id: $id, isEnable: $isEnable) {
            status
        }
    }
    `;

export const updateStaticPage = gql`
    mutation updateStaticPage(
      $id: Int,
      $content: String,
      $metaTitle: String,
      $metaDescription: String,
    ) {
      updateStaticPage(
        id: $id,
        content: $content,
        metaTitle: $metaTitle,
        metaDescription: $metaDescription,
      ) {
          status
      }
    }
    `;

export const getEditStaticPage = gql`query getEditStaticPage ($id: Int!) {
    getEditStaticPage (id: $id) {
        id
        pageName
        content
        metaTitle
        metaDescription
        createdAt
      }
    }`;

export const updateWhyHost = gql`
    mutation (
      $dataList: String
    ) {
        updateWhyHost (
            dataList:$dataList
        ) {
            status
            errorMessage                     
        }
    }`;

export const AddPhoneNumber = gql`
    mutation AddPhoneNumber($countryCode: String!, $phoneNumber: String!) {
        AddPhoneNumber(countryCode: $countryCode, phoneNumber: $phoneNumber) {
            status
            countryCode
            phoneNumber
            userProfileNumber
        }
    }
    `;

export const getPhoneData = gql`query {
    getPhoneData {
        userId
        profileId
        phoneNumber
        country
        countryCode
        verification {
          id
          isPhoneVerified
        }
      }
    }`;

export const DeleteWishListGroup = gql`
    mutation DeleteWishListGroup(
        $id: Int!,
    ){
        DeleteWishListGroup(
            id: $id
        ) {
            status
        }
    }
    `;

export const getAllWishListGroupQuery = gql`query ($profileId: Int!){
    getAllWishListGroup(profileId: $profileId){
        wishListGroupData {
          id
          name
          userId
          isPublic
          updatedAt
          wishListCount
          wishListCover {
            id
            listId
            listData {
              id
              title
              personCapacity
              beds
              bookingType
              coverPhoto
              reviewsCount,
              reviewsStarRating,
              listPhotos {
                id
                name
                type
                status
              }
              listingData {
                basePrice
                currency
              }
              settingsData {
                listsettings {
                  id
                  itemName
                }
              }
            }
          }
        }
        count
        status
      }
    }`;

export const locationItem = gql`
    query ($address: String) {
      locationItem(address: $address) {
        street
        city
        state
        country
        zipcode
        lat
        lng
        status
      }
    }
    `;

export const listPhotos = gql`
    query listPhotos($listId:Int!) {
      ShowListPhotos (listId:$listId) {
        id
        listId
        name
        type
        isCover
      }
    }
    `;
