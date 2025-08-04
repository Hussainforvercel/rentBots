import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

// Users
import validateEmailExist from './queries/Users/validateEmailExist.js'
import createUser from './mutations/Users/createUser.js';
import userLogin from './queries/Users/userLogin.js';
import adminUserLogin from './mutations/adminUserLogin.js';
import adminUserLogout from './mutations/adminUserLogout.js';
import testToken from './mutations/Users/testToken.js';
import userLogout from './mutations/Users/userLogout.js';
import userAccount from './queries/Users/userAccount.js';
import userUpdate from './mutations/Users/userUpdate.js';
import userForgotPassword from './mutations/Users/userForgotPassword.js';
import verifyForgotPassword from './queries/Users/verifyForgotPassword.js';
import updateForgotPassword from './mutations/Users/updateForgotPassword.js';
import userUpdateCommon from './mutations/Users/userUpdateCommon.js';
import getUserBanStatus from './queries/Users/getUserBanStatus.js';
import createListing from './mutations/CreateListing/createListing.js';
import updateListingStep2 from './mutations/CreateListing/updateListingStep2.js';
import updateListingStep3 from './mutations/CreateListing/updateListingStep3.js';
import managePublishStatus from './mutations/CreateListing/managePublishStatus.js';
import deleteUser from './mutations/Users/deleteUser.js';
import completeReservationTest from './mutations/TestMutation/completeReservationTest.js';
import getPopularLocations from './queries/Listing/getPopularLocations.js';
import changePassword from './mutations/Users/changePassword.js';

//Listing
import getListingSettings from './queries/ListSettings/getListingSettings.js';
import getListingSettingsCommon from './queries/ListSettings/getListingSettingsCommon.js';
import userSocialLogin from './queries/Users/userSocialLogin.js';
import getMostViewedListing from './queries/Listing/getMostViewedListing.js';
import getRecommend from './queries/Listing/getRecommend.js';
import viewListing from './queries/Listing/viewListing.js';
import getListingDetails from './queries/Listing/getListingDetails.js';
import getSimilarListing from './queries/Listing/getSimilarListing.js';
import getReviews from './queries/Listing/getReviews.js';
import SearchListing from './queries/Search/SearchListing.js';
import getSearchSettings from './queries/Search/getSearchSettings.js';
import cancelReservationData from './queries/Reservation/cancelReservationData.js';

import dateAvailability from './queries/Listing/dateAvailability.js';

//Reservation
import getAllReservation from './queries/Reservation/getAllReservation.js';

// Common
import userLanguages from './queries/Common/userLanguages.js';

// Billing Calculation
import getBillingCalculation from './queries/BillingCalculation/getBillingCalculation.js';
// Currency 
import getCurrencies from './queries/Currencies/getCurrencies.js';
import Currency from './queries/Currencies/Currency.js'
import getDateAvailability from './queries/ContactHost/getDateAvailability.js';
import CreateEnquiry from './mutations/ContactHost/CreateEnquiry.js';

// Reservation Details
import getReservation from './queries/Reservation/getReservation.js';
// SiteSettings
import getSecureSiteSettings from './queries/siteAdmin/getSecureSiteSettings.js';
import siteSettings from './queries/siteAdmin/siteSettings.js';

import getUnReadCount from './queries/UnReadCount/getUnReadCount.js';
import getUnReadThreadCount from './queries/UnReadCount/getUnReadThreadCount.js';
import createReservation from './mutations/Payment/createReservation.js';
import confirmReservation from './mutations/Payment/confirmReservation.js';
import getAllThreads from './queries/GetAllThreads/getAllThreads.js';
import getThreads from './queries/GetAllThreads/getThreads.js';
import showUserProfile from './queries/showUserProfile.js';
import confirmPayPalExecute from './mutations/Payment/confirmPayPalExecute.js';

import userReviews from './queries/Reviews/userReviews.js';

import createReportUser from './mutations/ReportUser/createReportUser.js';

import sendMessage from './mutations/Message/SendMessage.js';
import readMessage from './mutations/Message/ReadMessage.js';

import CreateWishListGroup from './mutations/WishList/CreateWishListGroup.js';
import CreateWishList from './mutations/WishList/CreateWishList.js';
import UpdateWishListGroup from './mutations/WishList/UpdateWishListGroup.js';
import DeleteWishListGroup from './mutations/WishList/DeleteWishListGroup.js';
import getAllWishListGroup from './queries/WishList/getAllWishListGroup.js';
import getWishListGroup from './queries/WishList/getWishListGroup.js';
import contactSupport from './queries/ContactSupport/contactSupport.js';
import getCountries from './queries/Countries/getCountries.js';
import EmailVerification from './mutations/EmailVerification/EmailVerification.js';

// Sms Verification
import getPhoneData from './queries/SmsVerification/getPhoneData.js';
import AddPhoneNumber from './mutations/SmsVerification/AddPhoneNumber.js';
import RemovePhoneNumber from './mutations/SmsVerification/RemovePhoneNumber.js';
import VerifyPhoneNumber from './mutations/SmsVerification/VerifyPhoneNumber.js';

// WhishList
import getAllWishList from './queries/WishList/getAllWishList.js';
import ResendConfirmEmail from './queries/Users/ResendConfirmEmail.js';

// Social Verification
import SocialVerification from './mutations/Users/SocialVerification.js';

// Create Listing
// import createListing from './mutations/CreateListing/createListing';
import locationItem from './queries/locationItem.js';
import showListingSteps from './queries/Listing/showListingSteps.js';
import ManageListingSteps from './mutations/CreateListing/ManageListingSteps.js';
import showListPhotos from './queries/Listing/showListPhotos.js';
import getPayouts from './queries/Payout/getPayouts.js';
import ManageListings from './queries/Listing/ManageListings.js';
import RemoveListPhotos from './mutations/CreateListing/RemoveListPhotos.js';

// Payout
import getPaymentMethods from './queries/Payout/getPaymentMethods.js';
import setDefaultPayout from './mutations/Payout/setDefaultPayout.js';
import addPayout from './mutations/Payout/addPayout.js';
import RemoveMultiPhotos from './mutations/CreateListing/RemoveMultiPhotos.js';
import verifyPayout from './mutations/Payout/verifyPayout.js';
import confirmPayout from './mutations/Payout/confirmPayout.js';

// Remove Listing
import RemoveListing from './mutations/CreateListing/RemoveListing.js';

// Update List Blocked
import UpdateListBlockedDates from './mutations/CreateListing/UpdateListBlockedDates.js';

// Get BlockedDates
import getListBlockedDates from './queries/Listing/getListBlockedDates.js';

// Reservation Status
import ReservationStatus from './mutations/Message/ReservationStatus.js';

// Cancell Reservation
import CancelReservation from './mutations/Payment/CancelReservation.js';

// User Feedback Email
import userFeedback from './mutations/userFeedback.js';
import UpdateSpecialPrice from './mutations/CreateListing/UpdateSpecialPrice.js';
import getListingSpecialPrice from './queries/Listing/getListingSpecialPrice.js';

// Mobile active social Logins
import getActiveSocialLogins from './queries/Common/getActiveSocialLogins.js';

// StripeKey
import getPaymentSettings from './queries/siteAdmin/getPaymentSettings.js';
import getImageBanner from './queries/siteAdmin/getImageBanner.js';

import updateClaim from './mutations/Payment/updateClaim.js';

import getStaticPageContent from './queries/StaticPage/getStaticPageContent.js';
import getApplicationVersionInfo from './queries/siteAdmin/getApplicationVersionInfo.js';

import getUserReviews from './queries/Reviews/getUserReviews.js';
import getPendingUserReviews from './queries/Reviews/getPendingUserReviews.js';
import writeUserReview from './mutations/Reviews/writeUserReview.js';
import getPropertyReviews from './queries/Reviews/getPropertyReviews.js';
import getPendingUserReview from './queries/Reviews/getPendingUserReview.js';
import getWhyHostData from './queries/siteAdmin/getWhyHostData.js';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      validateEmailExist,
      userAccount,
      userLanguages,
      verifyForgotPassword,
      getListingSettings,
      userSocialLogin,
      getMostViewedListing,
      getRecommend,
      viewListing,
      getListingDetails,
      getSimilarListing,
      getReviews,
      SearchListing,
      dateAvailability,
      getListingSettingsCommon,
      getAllReservation,
      getBillingCalculation,
      getCurrencies,
      Currency,
      getSearchSettings,
      getDateAvailability,
      getReservation,
      getUnReadCount,
      getUnReadThreadCount,
      getAllThreads,
      getThreads,
      showUserProfile,
      userReviews,
      cancelReservationData,
      getUserBanStatus,
      getAllWishListGroup,
      getWishListGroup,
      contactSupport,
      getCountries,
      getPhoneData,
      getAllWishList,
      ResendConfirmEmail,
      locationItem,
      showListingSteps,
      showListPhotos,
      getPayouts,
      ManageListings,
      getPaymentMethods,
      getListBlockedDates,
      getListingSpecialPrice,
      getActiveSocialLogins,
      getPaymentSettings,
      getStaticPageContent,
      getPopularLocations,
      getImageBanner,
      getApplicationVersionInfo,
      getUserReviews,
      getPendingUserReviews,
      getPropertyReviews,
      getPendingUserReview,
      getSecureSiteSettings,
      getWhyHostData,
      siteSettings
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      createUser,
      testToken,
      userLogout,
      userUpdate,
      userForgotPassword,
      updateForgotPassword,
      userLogin,
      adminUserLogin,
      adminUserLogout,
      CreateEnquiry,
      createReservation,
      confirmReservation,
      sendMessage,
      readMessage,
      createReportUser,
      userUpdateCommon,
      CreateWishList,
      CreateWishListGroup,
      DeleteWishListGroup,
      UpdateWishListGroup,
      AddPhoneNumber,
      RemovePhoneNumber,
      EmailVerification,
      VerifyPhoneNumber,
      SocialVerification,
      createListing,
      updateListingStep2,
      ManageListingSteps,
      updateListingStep3,
      managePublishStatus,
      RemoveListPhotos,
      setDefaultPayout,
      addPayout,
      RemoveListing,
      RemoveMultiPhotos,
      UpdateListBlockedDates,
      ReservationStatus,
      userFeedback,
      UpdateSpecialPrice,
      CancelReservation,
      verifyPayout,
      confirmPayout,
      deleteUser,
      updateClaim,
      completeReservationTest,
      confirmPayPalExecute,
      writeUserReview,
      changePassword
    }
  })
});

export default schema;
