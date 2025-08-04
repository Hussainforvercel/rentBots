import { gql } from 'react-apollo';

export const getAllListingsQuery = gql`query getAllListings($currentPage: Int, $searchList: String){
    getAllListings(currentPage: $currentPage, searchList: $searchList) {
      count
      usersData{
        id
          title
          city
          state
          street
          buildingName
          zipcode
          country
          createdAt
          isPublished
          isReady
          user{
              email
              profile {
                  firstName
              }
          }
          listPhotos {
              name
          }
          recommend{
              id
              listId
          }
       }
      }
    }`

export const addRecommendMutation = gql`
    mutation addRecommend($listId: Int){
      addRecommend(listId: $listId) {
        id
        listId
        status
        errorMessage
      }
    }
    `;

export const removeRecommendMutation = gql`
    mutation removeRecommend($listId: Int){
      removeRecommend(listId: $listId) {
        listId
        status
      }
    }
    `;

export const adminRemoveListing = gql`
    mutation adminRemoveListing($listId:Int!) {
      adminRemoveListing (listId:$listId) {
        status
        id
        name
      }
    }
    `;

export const manageListingSteps = gql`
    query ($listId:String!, $currentStep: Int!) {
      ManageListingSteps (listId:$listId, currentStep: $currentStep) {
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
        status
      }
    }
    `;

export const uploadListPhotosMutation = gql`
    mutation UploadListPhotos ($listId:Int!, $name: String, $type: String) {
      CreateListPhotos (listId:$listId, name: $name, type: $type) {
        status
        photosCount
      }
    } 
    `;

export const removeListPhotosMutation = gql`
    mutation RemoveListPhotos($listId:Int!, $name:String) {
      RemoveListPhotos (listId:$listId, name: $name) {
        status
        photosCount
        iscoverPhotoDeleted
      }
    }
    `;

export const reservationCount = gql`
    query getUpcomingBookings ($listId: Int!){
        getUpcomingBookings(listId: $listId){
          count
        }
      }`;

export const showListPhotosQuery = gql`
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

export const searchListing = gql`
    query(
        $personCapacity: Int,
        $dates: String,
        $currentPage: Int,
        $geography: String,
        $geoType: String,
        $lat: Float,
        $lng: Float,
        $sw_lat: Float, 
        $sw_lng: Float, 
        $ne_lat: Float, 
        $ne_lng: Float,
      ){
        SearchListing(
          personCapacity: $personCapacity,
          dates: $dates,
          currentPage: $currentPage,
          geography: $geography,
          geoType: $geoType,
          lat: $lat,
          lng: $lng,
          sw_lat: $sw_lat, 
          sw_lng: $sw_lng, 
          ne_lat: $ne_lat, 
          ne_lng: $ne_lng,
        ) {
          count
          results {
            id
            title
            personCapacity
            lat
            lng
            beds
            bookingType
            coverPhoto
            reviewsCount,
            reviewsStarRating,
            transmission
            listPhotos {
              id
              name
              type
              status
            }
            listingData {
              basePrice
              hourlyPrice
              currency
            }
            settingsData {
              listsettings {
                id
                itemName
                itemDescription
              }
            }
            wishListStatus
            isListOwner
          }
        }
      }
    `;

export const updateListViews = gql`
    mutation UpdateListViews($listId: Int!){
        UpdateListViews(listId: $listId) {
            status
        }
    }
    `;

export const manageListings = gql`
    query ManageListings{
      ManageListings {
        results {
          id
          title
          city
          updatedAt
          coverPhoto
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
    }
    `;

export const removeListing = gql`
    mutation RemoveListing($listId:Int!) {
      RemoveListing (listId:$listId) {
        status
        id
        name
      }
    }
    `;

export const removeListPhotos = gql`
    query ($listId:Int!, $name:String) {
      RemoveListPhotos (listId:$listId, name: $name) {
        status
        photosCount
        iscoverPhotoDeleted
      }
    }
    `;