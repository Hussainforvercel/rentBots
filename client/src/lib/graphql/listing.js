import { gql } from 'react-apollo';

export const GetCalendars = gql`
    query GetCalendars($listId: Int!) {
        getListingCalendars(listId: $listId) {
            id
            name
            url
            listId
            status
        }
    }`;

export const DeleteCalendar = gql`
    mutation DeleteCalendar($listId: Int!, $calendarId: Int!) {
        deleteCalendar(listId: $listId, calendarId: $calendarId) {
            status
        }
      }
    `;

export const UserListing = gql`
    query ($listId:String!, $preview: Boolean) {
      UserListing (listId:$listId, preview: $preview) {
        id
        userId
        bookingType
        isPublished
        houseRules {
          houseRulesId
        }
        listingData {
          bookingNoticeTime,
          checkInStart,
          checkInEnd,
          maxDaysNotice,
          minDay,
          maxDay,
          basePrice,
          delivery,
          currency,
          weeklyDiscount,
          monthlyDiscount,
          cancellationPolicy
          securityDeposit
        }
        blockedDates {
          blockedDates
          reservationId
          calendarStatus
          isSpecialPrice
        }
        calendars {
          id
          name
          url
          listId
          status
        }
        listBlockedPrice {
          listId
          calendarStatus
          isSpecialPrice
          blockedDates
          calendarId
          reservationId
        }
      }
    }
    `;

export const updateListingStep3  = gql`
    mutation updateListingStep3 (
       $id: Int,
    $carRules: [Int],
    $bookingNoticeTime: String,
    $checkInStart: String,
    $checkInEnd: String,
    $maxDaysNotice: String,
    $minDay: Int,
    $maxDay: Int,
    $minHours: Int,
    $maxHours: Int,
    $basePrice: Float,
    $delivery: Float,
    $currency: String,
    $weeklyDiscount: Float,
    $monthlyDiscount: Float,
    $hourlyPrice: Float,
    $hourlyDiscount: Float,
    $dailyDiscount: Float,
    $bookingType: String!,
    $cancellationPolicy: Int,
    $securityDeposit: Float
    ){
        updateListingStep3 (
          id: $id,
      carRules: $carRules,
      bookingNoticeTime: $bookingNoticeTime,
      checkInStart: $checkInStart,
      checkInEnd: $checkInEnd,
      maxDaysNotice: $maxDaysNotice,
      minDay: $minDay,
      maxDay: $maxDay,
      minHours: $minHours,
      maxHours: $maxHours,
      basePrice: $basePrice,
      delivery: $delivery,
      currency: $currency,
      weeklyDiscount: $weeklyDiscount,
      monthlyDiscount: $monthlyDiscount,
      hourlyPrice: $hourlyPrice,
      hourlyDiscount: $hourlyDiscount,
      dailyDiscount: $dailyDiscount,
      bookingType: $bookingType,
      cancellationPolicy: $cancellationPolicy,
      securityDeposit: $securityDeposit
        ) {
         status
      }
    }
    `;

export const getStepTwo = gql`
    query getStepTwo($listId:String!) {
        getStepTwo (listId:$listId) {
          id
          userId
          title
          description
          coverPhoto
          listPhotos {
            id
            name
          }
        }
      }
    `;

export const getSpecialPricing = gql`
    query (
        $listId:Int!,  
        $startDate: String!, 
        $endDate: String!
    ) {
        getSpecialPricing (
            listId:$listId, 
            startDate:$startDate, 
            endDate: $endDate
        ) {
            id
            listId
            blockedDates
            calendarStatus
            isSpecialPrice
        }
    }
    `;

export const BlockImportedDates = gql`
    mutation BlockImportedDates(
        $listId: Int!, 
        $calendarId: Int!, 
        $blockedDates: [String]
    ) {
        blockImportedDates(
            listId: $listId, 
            calendarId: $calendarId, 
            blockedDates: $blockedDates
        ) {
            status
        }
    }
`;

export const ManageListingQuery = gql` 
    query ManageListings{
        ManageListings {
            results {
            id
            title
            city
            updatedAt
            coverPhoto
            isPublished
            isReady
            listPhotos{
                id
                name
            }
            settingsData {
                listsettings {
                    id
                    itemName
                }
            }
            listingSteps {
                id
                step1
                step2
                step3
            }
        }
    }
    }`;

export const ListingStepsQuery = gql`
    query ($listId:String!) {
        showListingSteps (listId:$listId) {
            id
            listId
            step1
            step2
            step3
            listing {
                id
                isReady
                isPublished
            }
        }
    }`;

export const getUpcomingBookingQuery = gql`
    query getUpcomingBookings ($listId: Int!){
        getUpcomingBookings(listId: $listId){
          count
        }
      }`;

export const ManagePublish = gql`
    mutation ManagePublish($listId: Int!, $action: String!) {
        managePublish(listId: $listId, action: $action) {
            status
        }
    }
    `;

export const WishListStatus = gql`
    mutation updateListStatus($listId:Int!, $action: String!) {
         updateListStatus (listId:$listId, action: $action) {
            status
         }
     }
    `;

export const userListingQuery = gql`
    query ($listId:String!, $preview: Boolean) {
      UserListing (listId:$listId, preview: $preview) {
        id
        userId
        country
        street
        buildingName
        city
        state
        zipcode
        lat
        lng
        isMapTouched
        bedrooms
        beds
        personCapacity
        bathrooms
        transmission
        user {
          email
          userBanStatus
          profile{
            firstName
            lastName
            dateOfBirth
          }
        }
        userAmenities {
          amenitiesId
          listsettings{
            itemName
            settingsType {
              typeName
            }
          }
        }
        userSafetyAmenities {
          safetyAmenitiesId
          listsettings{
            itemName
            settingsType {
              typeName
            }
          }
        }
        userSpaces {
          spacesId
          listsettings{
            itemName
            settingsType {
              typeName
            }
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
        userBedsTypes{
          id
          listId
          bedCount
          bedType
        }
      }
    }
    `;

export const userListingStepTwo = gql`
    query ($listId:String!, $preview: Boolean) {
      UserListing (listId:$listId, preview: $preview) {
        id
        userId
        title
        description
        coverPhoto
      }
    }
    `;

export const userListingStepThree = gql`
    query ($listId:String!, $preview: Boolean) {
      UserListing (listId:$listId, preview: $preview) {
        id
        userId
        bookingType
        isPublished
        houseRules {
          houseRulesId
        }
        listingData {
          bookingNoticeTime,
          checkInStart,
          checkInEnd,
          maxDaysNotice,
          minDay,
          maxDay,
          basePrice,
          minHours,
          maxHours,
          hourlyPrice,
          hourlyDiscount,
          dailyDiscount
          delivery,
          currency,
          weeklyDiscount,
          monthlyDiscount,
          cancellationPolicy
          securityDeposit
        }
        blockedDates {
          blockedDates
          reservationId
          calendarStatus
          isSpecialPrice
          startTime
          endTime
        }
        calendars {
          id
          name
          url
          listId
          status
        }
        listBlockedPrice {
            listId
            calendarStatus
            isSpecialPrice
            blockedDates
            calendarId
            reservationId
        }
      }
    }
    `;

export const getListingSettings = gql`
{
  getListingSettings {
    id
    typeName
    fieldType
    typeLabel
    step
    isEnable
    listSettings {
      id
      typeId
      itemName
      itemDescription
      otherItemName
      maximum
      minimum
      startValue
      endValue
      isEnable
      makeType
    }
  }
}`;

export const getListingSettingsQuery = gql`
    query($step: String){
      getListingSettings(step: $step) {
        id
        typeName
        fieldType
        typeLabel
        step
        isEnable
        isMultiValue
        listSettings {
          id
          typeId
          itemName
          otherItemName
          maximum
          minimum
          startValue
          endValue
          isEnable
          makeType
        }
      }
    }`;

export const showListingSteps = gql`
    query ($listId:String!) {
      showListingSteps (listId:$listId) {
        id
        listId
        step1
        step2
        step3
        listing {
          id
          isReady
          isPublished
          user {
            userBanStatus
            userDeletedAt
          }
        }
      }
    }`;

export const cancelQuery = gql`query getAllCancellation{
    getAllCancellation {
        id
        policyName
        policyContent
      }
    }`