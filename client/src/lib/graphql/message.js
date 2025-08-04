import { gql } from 'react-apollo';

export const createThreadItems = gql`
    mutation CreateThreadItems(
       $listId: Int!, 
       $host: String!,
       $content: String!,
       $type: String,
       $startDate: String,
       $endDate: String,
       $personCapacity: Int,
       $startTime: Float,
       $endTime: Float,
     ){
         CreateThreadItems(
           listId: $listId,
           host: $host,
           content: $content,
           type: $type,
           startDate: $startDate,
           endDate: $endDate,
           personCapacity: $personCapacity,
           startTime: $startTime,
           endTime: $endTime,
         ) {
             id
             threadId
             sentBy
             content
             type
             startDate
             endDate
             personCapacity
             createdAt
         }
     }
    `;

export const countQuery = gql`
    query getUnreadCount{
      getUnreadCount {
        hostCount
        guestCount
        total
      }
    }
    `;

export const unreadThreadsQuery = gql`
query getUnreadThreads{
  getUnreadThreads {
    id
    listId
    host
    guest
    listData {
      city
      state
      country
    }
    threadItemUnread {
      id
      threadId
      content
      sentBy
      isRead
      type
      createdAt
      startDate
      endDate
      personCapacity
    }
    hostProfile {
      profileId
      displayName
      picture
    }
    guestProfile {
      profileId
      displayName
      picture
    }
    status
  }
}
    `;

export const inboxQuery = gql`
    query GetAllThreads($threadType: String, $threadId: Int, $currentPage: Int){
      GetAllThreads(threadType: $threadType, threadId: $threadId, currentPage: $currentPage) {
        threadsData {
          id
          listId
          guest
          listData {
            street
            city
            state
            country
            zipcode
          }
          threadItem {
            id
            threadId
            content
            sentBy
            isRead
            type
            startDate
            endDate
            createdAt
            startTime
            endTime
          }
          guestProfile {
            firstName
            profileId
            displayName
            picture
          }
          hostProfile {
            firstName
            profileId
            displayName
            picture
          }
          status
        }
        count
      }
    }
    `;

export const readMessage = gql`
    mutation readMessage($threadId: Int!){
        readMessage(threadId: $threadId) {
          status
            }
          }
    `;

export const threadItemsQuery = gql`
    query getThread($threadType: String, $threadId: Int){	
      getThread(threadType: $threadType, threadId: $threadId) {	
        id	
        listId	
        guest	
        host	
        listData {	
          title	
          city	
          state	
          country	
          isPublished	
          listingData {	
            basePrice	
            delivery	
            currency	
            monthlyDiscount	
            weeklyDiscount	
          }	
        }	
        threadItemForType {	
          id	
          threadId	
          reservationId	
          content	
          sentBy	
          type	
          startDate	
          endDate	
          personCapacity	
          createdAt	
          startTime	
          endTime	
          cancelData {	
            id	
            reservationId	
            cancellationPolicy	
            guestServiceFee	
            hostServiceFee	
            refundToGuest	
            payoutToHost	
            total 	
            currency	
            createdAt	
          }	
          reservation {	
            id	
            listId	
            hostId	
            guestId	
            listTitle	
            checkIn	
            checkOut	
            basePrice	
            delivery	
            total	
            currency	
            guests	
            confirmationCode	
            guestServiceFee	
            discount	
            discountType	
            createdAt	
            updatedAt	
            hostServiceFee	
            startTime	
            endTime	
            reservationState	
            securityDeposit	
            claimStatus	
            claimAmount	
            claimPayout	
            claimRefund	
            claimReason	
            claimImages	
            bookingSpecialPricing {	
              id	
              reservationId	
              blockedDates	
              isSpecialPrice	
            }	
          }	
        }	
        threadItems {	
          id	
          threadId	
          reservationId	
          content	
          sentBy	
          type	
          startDate	
          endDate	
          createdAt	
        }	
        threadItemsCount	
        guestProfile {	
          profileId	
          displayName	
          firstName	
          picture	
          location	
          reviewsCount	
          userVerification {	
            id	
            isEmailConfirmed	
            isFacebookConnected	
            isGoogleConnected	
            isIdVerification	
          }	
        }	
        guestUserData {	
          email	
          userBanStatus	
        }	
        hostProfile {	
          profileId	
          displayName	
          firstName	
          picture	
          location	
          reviewsCount	
          userVerification {	
            id	
            isEmailConfirmed	
            isFacebookConnected	
            isGoogleConnected	
            isIdVerification	
          }	
        }	
        hostUserData {	
          email	
          userBanStatus	
        }	
        status	
      }	
    }
    `;

export const sendMessage = gql`
    mutation sendMessage(
    $threadId: Int!, 
    $content: String, 
    $type: String,
    $startDate: String,
    $endDate: String,
    $personCapacity: Int,
    $reservationId: Int,
    $startTime: Float,
    $endTime: Float,
    ) {
      sendMessage(
      threadId: $threadId, 
      content: $content, 
      type: $type,
      startDate: $startDate,
      endDate: $endDate,
      personCapacity: $personCapacity,
      reservationId: $reservationId,
      startTime: $startTime,
      endTime: $endTime
      ){
        id
        sentBy
        content
        type
        reservationId
        startDate
        endDate
        personCapacity
        createdAt
        status
      }
    }
    `;

export const createReservationThread = gql`
    mutation createReservationThread($reservationId: Int!) {
      createReservationThread(reservationId: $reservationId) {
        id
        threadId
        reservationId
        sentBy
        content
        type
        startDate
        endDate
        personCapacity
        createdAt
        status
      }
    }
`;