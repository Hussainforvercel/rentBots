import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import intl from './queries/intl';
import userLogin from './queries/userLogin';
import userLogout from './queries/userLogout';
import userRegister from './queries/userRegister';
import userAccount from './queries/userAccount';
import userEditProfile from './queries/userEditProfile';
import showUserProfile from './queries/showUserProfile';
import locationItem from './queries/locationItem';
import createListing from './queries/createListing';
import showListingSteps from './queries/showListingSteps';
import ManageListingSteps from './queries/ManageListingSteps';
import getListingSettings from './queries/getListingSettings';
import updateListing from './queries/updateListing';
import updateListingStep2 from './queries/updateListingStep2';
import updateListingStep3 from './mutations/CreateListing/updateListingStep3';
import DateAvailability from './queries/DateAvailability';

import getListingSpecSettings from './queries/getListingSpecSettings';
import GetAddressComponents from './queries/GetAddressComponents';
import getCountries from './queries/getCountries';
import getBanner from './queries/getBanner';
import getRecommend from './queries/getRecommend';
import ChangePassword from './queries/ChangePassword';
import getUserVerifiedInfo from './queries/getUserVerifiedInfo';
import updateUserVerifiedInfo from './queries/updateUserVerifiedInfo';
import UploadProfilePicture from './queries/UploadProfilePicture';
import RemoveProfilePicture from './queries/RemoveProfilePicture';
import getImageBanner from './queries/getImageBanner';
import GetListViews from './queries/GetListViews';
import GetMostViewedListing from './queries/GetMostViewedListing';
import EmailVerification from './queries/EmailVerification';
import ResendConfirmEmail from './queries/ResendConfirmEmail';

// Forgot Password
import sendForgotPassword from './mutations/ForgotPassword/SendForgotPassword';
import forgotPasswordVerification from './queries/ForgotPassword/ForgotPasswordVerification';
import changeForgotPassword from './mutations/ForgotPassword/ChangeForgotPassword';

// Payout
import getPaymentMethods from './queries/Payout/getPaymentMethods';
import addPayout from './mutations/Payout/addPayout';
import removePayout from './mutations/Payout/removePayout';
import setDefaultPayout from './mutations/Payout/setDefaultPayout';
import getPayouts from './queries/Payout/getPayouts';

// Payment/Booking
import createReservation from './mutations/Payment/createReservation';
import updateReservationPaymentState from './mutations/Payment/updateReservationPaymentState';

// Reservation
import getItinerary from './queries/Reservation/getItinerary';
import getAllReservation from './queries/Reservation/getAllReservation';
import getAllReservationAdmin from './queries/Reservation/getAllReservationAdmin';
import checkReservation from './queries/Reservation/checkReservation';
import updateReservation from './mutations/Reservation/updateReservation';
import getPaymentData from './queries/Reservation/getPaymentData';
import cancelReservationData from './queries/Reservation/cancelReservationData';
import cancelReservation from './mutations/Reservation/cancelReservation';
import viewReservationAdmin from './queries/Reservation/viewReservationAdmin'
import getPaymentState from './queries/Reservation/getPaymentState';

// Transaction History
import getTransactionHistory from './queries/TransactionHistory/getTransactionHistory';
import updatePayoutForReservation from './mutations/TransactionHistory/updatePayoutForReservation';

// Message System
import CreateThreadItems from './mutations/CreateThreadItems';
import CreateReservationThread from './mutations/CreateReservationThread';
import GetAllThreads from './queries/GetAllThreads';
import getThread from './queries/getThread';
import sendMessage from './mutations/SendMessage';
import getUnreadThreads from './queries/getUnreadThreads';
import getUnreadCount from './queries/getUnreadCount';
import readMessage from './mutations/ReadMessage';
import getAllThreadItems from './queries/Messages/getAllThreadItems';

// Ban/ Unban user
import getUserBanStatus from './queries/getUserBanStatus';

// Remove Listing
import RemoveListing from './mutations/Listing/RemoveListing';

// Currency
import getCurrencies from './queries/getCurrencies';
import Currency from './queries/Currency';
import StoreCurrencyRates from './queries/StoreCurrencyRates';
import getBaseCurrency from './queries/getBaseCurrency';
import managePaymentCurrency from './mutations/Currency/managePaymentCurrency'

// Manage Listing
import ManageListings from './queries/ManageListings';
import managePublish from './mutations/Listing/ManagePublish';

import getListingCalendars from './queries/Listing/getListingCalendars';
import deleteCalendar from './mutations/Listing/DeleteImportCalendar';
import blockImportedDates from './mutations/Listing/BlockImportedDates';

// Search Listing
import SearchListing from './queries/SearchListing';

// List Photos
import CreateListPhotos from './mutations/CreateListing/CreateListPhotos';
import RemoveListPhotos from './mutations/CreateListing/RemoveListPhotos';
import ShowListPhotos from './queries/ShowListPhotos';

import UserListing from './queries/UserListing';
import getListMeta from './queries/Listing/getListMeta';

import getProfile from './queries/UserProfile';

import getSearchSettings from './queries/getSearchSettings';

import UpdateListViews from './queries/UpdateListViews';

// For Site Admin

// User Management
import deleteUser from './mutations/UserManagement/deleteUser';

// Listing Management
import addRecommend from './mutations/SiteAdmin/ListingManagement/addRecommend';
import removeRecommend from './mutations/SiteAdmin/ListingManagement/removeRecommend';
import adminRemoveListing from './mutations/SiteAdmin/ListingManagement/adminRemoveListing';

// Currency Management
import currencyManagement from './mutations/SiteAdmin/CurrencyManagement/currencyManagement';
import baseCurrency from './mutations/SiteAdmin/CurrencyManagement/baseCurrency';

// Logo
import uploadLogo from './mutations/SiteAdmin/Logo/uploadLogo';
import removeLogo from './mutations/SiteAdmin/Logo/removeLogo';
import getLogo from './queries/siteadmin/getLogo';
import getHomeLogo from './queries/siteadmin/getHomeLogo';
import uploadHomeLogo from './mutations/SiteAdmin/HomeLogo/uploadHomeLogo';
import removeHomeLogo from './mutations/SiteAdmin/HomeLogo/removeHomeLogo';
import getEmailLogo from './queries/siteadmin/getEmailLogo';
import uploadEmailLogo from './mutations/SiteAdmin/Logo/uploadEmailLogo';
import updateSiteSettingsLogo from './mutations/SiteAdmin/Logo/updateSiteSettingsLogo';
import getSiteSettingsLogo from './queries/siteadmin/getSiteSettingsLogo';

// Location
import uploadLocation from './mutations/SiteAdmin/PopularLocation/uploadLocation';
import removeLocation from './mutations/SiteAdmin/PopularLocation/removeLocation';

import adminUserLogin from './queries/siteadmin/adminUserLogin';
import changeAdminUser from './mutations/SiteAdmin/changeAdminUser';

import userManagement from './queries/siteadmin/userManagement';
import siteSettings from './queries/siteadmin/siteSettings';
import updateSiteSettings from './queries/siteadmin/updateSiteSettings';

import addListSettings from './queries/siteadmin/addListSettings';
import updateListSettings from './queries/siteadmin/updateListSettings';
import deleteListSettings from './queries/siteadmin/deleteListSettings';

import getAllListings from './queries/siteadmin/getAllListings';
import updateSearchSettings from './queries/siteadmin/updateSearchSettings';
import updateBannerSettings from './queries/siteadmin/updateBannerSettings';

import getUserDashboard from './queries/siteadmin/getUserDashboard';
import getListingDashboard from './queries/siteadmin/getListingDashboard';
import updateImageBanner from './queries/siteadmin/updateImageBanner';
import uploadImageBanner from './queries/siteadmin/uploadImageBanner';
import getReservationDashboard from './queries/siteadmin/getReservationDashboard';
import messageManagement from './queries/siteadmin/messageManagement';
import reviewsManagement from './queries/siteadmin/reviewsManagement';
import reportUserManagement from './queries/siteadmin/reportUserManagement';
import updateFindYourBlock from './queries/siteadmin/updateFindYourBlock';

import getPopularLocation from './queries/siteadmin/getPopularLocation';
import editPopularLocation from './queries/siteadmin/editPopularLocation';
import deletePopularLocation from './mutations/SiteAdmin/deletePopularLocation';
import updatePopularLocation from './mutations/SiteAdmin/updatePopularLocation';
import updatePopularLocationStatus from './mutations/SiteAdmin/updatePopularLocationStatus';
import addPopularLocation from './mutations/SiteAdmin/addPopularLocation';

// Service Fees
import updateServiceFees from './mutations/ServiceFees/updateServiceFees';
import getServiceFees from './queries/ServiceFees/getServiceFees';

// Cancellation
import getAllCancellation from './queries/Cancellation/getAllCancellation';
// Reviews
import userReviews from './queries/Reviews/userReviews';
import pendingReviews from './queries/Reviews/pendingReviews';
import writeReview from './mutations/Reviews/writeReview';
import writeReviewData from './queries/Reviews/writeReviewData';
import moreListReviews from './queries/Reviews/moreListReviews';
import writeAdminReview from './mutations/SiteAdmin/AdminReview/writeAdminReview';
import getAdminReviews from './queries/siteadmin/getAdminReviews';
import deleteAdminReview from './mutations/SiteAdmin/AdminReview/deleteAdminReview';
import editAdminReview from './queries/siteadmin/editAdminReview';

//document 
import uploadDocument from './mutations/Document/uploadDocument';
import RemoveDocumentList from './mutations/DocumentList/RemoveDocumentList';
import ShowDocumentList from './queries/DocumentList/ShowDocumentList'
import showAllDocument from './queries/siteadmin/Document/showAllDocument';
import DocumentManagement from './mutations/SiteAdmin/DocumentVerification/DocumentManagement';

// Wish List
import getAllWishListGroup from './queries/WishList/getAllWishListGroup';
import CreateWishListGroup from './mutations/WishList/CreateWishListGroup';
import getWishListGroup from './queries/WishList/getWishListGroup';
import UpdateWishListGroup from './mutations/WishList/UpdateWishListGroup';
import DeleteWishListGroup from './mutations/WishList/DeleteWishListGroup';
import CreateWishList from './mutations/WishList/CreateWishList';

import CreateFooterSetting from './mutations/SiteAdmin/FooterBlock/CreateFooterSetting';

import getFooterSetting from './queries/siteadmin/getFooterSetting';

import CreateReportUser from './mutations/ReportUser/CreateReportUser';

// Similar Listings
import getSimilarListing from './queries/SimilarListings/getSimilarListing';

// SMS Verification
import getPhoneData from './queries/SmsVerification/getPhoneData';
import AddPhoneNumber from './mutations/SmsVerification/AddPhoneNumber';
import VerifyPhoneNumber from './mutations/SmsVerification/VerifyPhoneNumber';
import RemovePhoneNumber from './mutations/SmsVerification/RemovePhoneNumber';
import updateListStatus from './mutations/WishList/updateListStatus';
import getUserStatus from './queries/getUserStatus';

// Update user ban

import updateBanServiceHistoryStatus from './mutations/SiteAdmin/updateBanServiceHistoryStatus';

//View profile
import ManageListingsProfile from './queries/ViewProfile/ManageListingsProfile';

// Transaction 
import ManageListingTransaction from './queries/ManageListing/ManageListingTransaction';

// Popular Location 
import getPopularLocationAdmin from './queries/siteadmin/getPopularLocationAdmin';

// Day Drag Calendar
// import ListingDataUpdate from './mutations/Listing/ListingDataUpdate';
import UpdateBlockedDates from './mutations/Listing/UpdateBlockedDates';
import removeBlockedDates from './mutations/Listing/removeBlockedDates';
//import UpdateAvailableDates from './mutations/Listing/UpdateAvailableDates';
import getSpecialPricing from './queries/Listing/getSpecialPricing';
import getUpcomingBookings from './queries/getUpcomingBookings'
import getCheckUserStatus from './queries/getCheckUserStatus';
import getStepTwo from './queries/Listing/getStepTwo';

//blog
import getBlogDetails from './queries/getBlogDetails';
import getBlogHome from './queries/siteadmin/getBlogHome';
import getEnabledBlog from './queries/siteadmin/getEnabledBlog';
import editBlogDetails from './queries/siteadmin/editBlogDetails';
import deleteBlogDetails from './mutations/SiteAdmin/deleteBlogDetails';
import addBlogDetails from './mutations/SiteAdmin/addBlogDetails';
import updateBlogDetails from './mutations/SiteAdmin/updateBlogDetails';
import updateBlogStatus from './mutations/SiteAdmin/updateBlogStatus';

import getEditStaticPage from './queries/siteadmin/getEditStaticPage';
import updateStaticPage from './mutations/SiteAdmin/updateStaticPage';

// SiteAdmin Reviews
import getReviewsDetails from './queries/siteadmin/Reviews/getReviewsDetails';
import editUserReviews from './queries/siteadmin/Reviews/editUserReviews';

import writeUserReview from './mutations/SiteAdmin/userReview/writeUserReview';
import updateReview from './mutations/SiteAdmin/userReview/updateReview';

// Car Type
import getCarDetails from './queries/siteadmin/getCarDetails';

import uploadHomeBanner from './queries/siteadmin/uploadHomeBanner'

//SiteAdmin Static Block Info
import updateStaticInfoBlock from './mutations/SiteAdmin/updateStaticInfoBlock';
import getStaticInfo from './queries/siteadmin/getStaticInfo';
import uploadStaticBlockImage from './mutations/SiteAdmin/uploadStaticBlockImage';
import removeStaticBlockImages from './mutations/SiteAdmin/removeStaticBlockImages';
import getFindYourVehicleBlock from './queries/siteadmin/getFindYourVehicleBlock';

//Site Admin WhyHost
import getWhyHostPage from './queries/siteadmin/getWhyHostPage';
import updateWhyHostPage from './mutations/SiteAdmin/updateWhyHostPage';

//Auto Payout
import getAllPayoutReservation from './queries/AutoPayout/getAllPayoutReservation';
import getFailedTransaction from './queries/AutoPayout/getFailedTransaction';
import updatePayoutStatus from './mutations/AutoPayout/updatePayoutStatus';

//Manage Payment Gateway
import getAllPaymentMethods from './queries/siteadmin/getAllPaymentMethods';
import updatePaymentGatewayStatus from './mutations/SiteAdmin/updatePaymentGatewayStatus';
import getAllAdminListSettings from './queries/siteadmin/getAllAdminListSettings';

import adminUserLogout from './queries/siteadmin/adminUserLogout';

// Admin Roles
import createAdminRole from './mutations/SiteAdmin/AdminRoles/createAdminRole';
import getAllAdminRoles from './queries/siteadmin/AdminRoles/getAllAdminRoles';
import deleteAdminRole from './mutations/SiteAdmin/AdminRoles/deleteAdminRole';

// Admin Users
import getAllAdminUsers from './queries/siteadmin/AdminUser/getAllAdminUsers';
import createAdminUser from './mutations/SiteAdmin/AdminUser/createAdminUser';
import deleteAdminUser from './mutations/SiteAdmin/AdminUser/deleteAdminUser';
import getAdminUser from './queries/siteadmin/AdminUser/getAdminUser';
import getUserExists from './queries/siteadmin/AdminUser/getUserExists';
import getAdminRoles from './queries/siteadmin/AdminRoles/getAdminRoles';

import getPrivileges from './queries/siteadmin/AdminRoles/getPrivileges';

import updateClaimForHost from './mutations/Reservation/updateClaimForHost';
import updateClaimRefund from './mutations/SiteAdmin/updateClaimRefund';
import getHomeData from './queries/Home/getHomeData';
import updateConfigSettings from './mutations/SiteAdmin/updateConfigSettings';
import getConfigSettings from './queries/siteadmin/getConfigSettings';

import updateWhyHost from './mutations/SiteAdmin/updateWhyHost';
import getWhyHostData from './queries/siteadmin/getWhyHostData';
import checkListing from './queries/checkListing';

import getWhyHostAllReviews from './queries/siteadmin/WhyHostReview/getWhyHostAllReviews';
import getWhyHostReview from './queries/siteadmin/WhyHostReview/getWhyHostReview';
import deleteWhyHostReview from './mutations/SiteAdmin/WhyHostReview/deleteWhyHostReview';
import updateWhyHostReview from './mutations/SiteAdmin/WhyHostReview/updateWhyHostReview';
import getHomeWhyHostReview from './queries/siteadmin/WhyHostReview/getHomeWhyHostReview';
import UpdateClaimPayout from './mutations/SiteAdmin/updateClaimPayout';
import makeModelCsvUploader from './queries/siteadmin/makeModelCsvUploader';

import payoutToHost from './mutations/payoutToHost';

import createMarketingBanner from './mutations/SiteAdmin/createMarketingBanner';

import getMarketingBanner from './queries/siteadmin/getMarketingBanner';

import updateMarketingBanner from './mutations/SiteAdmin/updateMarketingBanner';

// Language Schema
const languageSchema = `
  type Language {
    id: Int
    title: String
    code: String
    fileURL: String
  }

  type LanguageResponse {
    status: Int
    errorMessage: String
  }

  extend type Query {
    getLanguages: [Language]
  }

  extend type Mutation {
    createLanguage(title: String!, code: String!, fileURL: String): LanguageResponse
    updateLanguage(id: Int!, title: String!, code: String!, fileURL: String): LanguageResponse
    deleteLanguage(id: Int!): LanguageResponse
  }
`;

import getLanguages from './queries/siteadmin/getLanguages';
import createLanguage from './mutations/SiteAdmin/Language/createLanguage';
import updateLanguage from './mutations/SiteAdmin/Language/updateLanguage';
import deleteLanguage from './mutations/SiteAdmin/Language/deleteLanguage';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      intl,
      userLogin,
      userLogout,
      userRegister,
      userAccount,
      userEditProfile,
      userManagement,
      showUserProfile,
      adminUserLogin,
      siteSettings,
      updateSiteSettings,
      locationItem,
      createListing,
      updateListing,
      showListingSteps,
      addListSettings,
      updateListSettings,
      deleteListSettings,
      getListingSettings,
      UserListing,
      getProfile,
      updateListingStep2,
      updateListingStep3,
      ManageListingSteps,
      ShowListPhotos,
      DateAvailability,
      getListingSpecSettings,
      getCurrencies,
      Currency,
      ManageListings,
      getAllListings,
      SearchListing,
      getBaseCurrency,
      StoreCurrencyRates,
      updateSearchSettings,
      getSearchSettings,
      GetAddressComponents,
      getLogo,
      getHomeLogo,
      getCountries,
      getBanner,
      updateBannerSettings,
      getRecommend,
      getUserDashboard,
      getListingDashboard,
      getUserVerifiedInfo,
      getImageBanner,
      GetListViews,
      GetMostViewedListing,
      EmailVerification,
      ResendConfirmEmail,
      GetAllThreads,
      getThread,
      getUnreadThreads,
      getUnreadCount,
      getPaymentMethods,
      getPayouts,
      getItinerary,
      getAllReservation,
      getAllReservationAdmin,
      getTransactionHistory,
      getServiceFees,
      getPaymentData,
      getAllThreadItems,
      getAllCancellation,
      cancelReservationData,
      userReviews,
      pendingReviews,
      writeReviewData,
      moreListReviews,
      forgotPasswordVerification,
      getListingCalendars,
      getListMeta,
      getAdminReviews,
      editAdminReview,
      getAllWishListGroup,
      getWishListGroup,
      viewReservationAdmin,
      getSimilarListing,
      getReservationDashboard,
      ShowDocumentList,
      showAllDocument,
      getFooterSetting,
      getPhoneData,
      ManageListingsProfile,
      getUserBanStatus,
      ManageListingTransaction,
      getPopularLocation,
      editPopularLocation,
      getUserStatus,
      checkReservation,
      getPopularLocationAdmin,
      getSpecialPricing,
      getUpcomingBookings,
      getBlogDetails,
      editBlogDetails,
      getBlogHome,
      getEnabledBlog,
      getCheckUserStatus,
      getCheckUserStatus,
      messageManagement,
      reviewsManagement,
      reportUserManagement,
      getEditStaticPage,
      getReviewsDetails,
      editUserReviews,
      getStepTwo,
      getCarDetails,
      getStaticInfo,
      getWhyHostPage,
      getAllPayoutReservation,
      getFailedTransaction,
      getAllPaymentMethods,
      getAllAdminListSettings,
      adminUserLogout,
      getAllAdminRoles,
      getAllAdminUsers,
      getAdminUser,
      getPrivileges,
      getAdminRoles,
      getEmailLogo,
      getSiteSettingsLogo,
      getFindYourVehicleBlock,
      getHomeData,
      getConfigSettings,
      getWhyHostData,
      checkListing,
      getWhyHostAllReviews,
      getWhyHostReview,
      getHomeWhyHostReview,
      getUserExists,
      getPaymentState,
      getMarketingBanner,
      getLanguages
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      addRecommend,
      removeRecommend,
      ChangePassword,
      updateUserVerifiedInfo,
      UploadProfilePicture,
      RemoveProfilePicture,
      updateImageBanner,
      uploadImageBanner,
      UpdateListViews,
      CreateThreadItems,
      CreateReservationThread,
      sendMessage,
      readMessage,
      addPayout,
      removePayout,
      setDefaultPayout,
      createReservation,
      updatePayoutForReservation,
      updateServiceFees,
      updateReservation,
      managePaymentCurrency,
      RemoveListing,
      deleteUser,
      adminRemoveListing,
      currencyManagement,
      baseCurrency,
      uploadLogo,
      removeLogo,
      uploadHomeLogo,
      removeHomeLogo,
      CreateListPhotos,
      RemoveListPhotos,
      cancelReservation,
      writeReview,
      sendForgotPassword,
      changeForgotPassword,
      managePublish,
      changeAdminUser,
      deleteCalendar,
      blockImportedDates,
      writeAdminReview,
      deleteAdminReview,
      CreateWishListGroup,
      UpdateWishListGroup,
      DeleteWishListGroup,
      uploadDocument,
      RemoveDocumentList,
      DocumentManagement,
      CreateWishList,
      CreateFooterSetting,
      CreateReportUser,
      AddPhoneNumber,
      VerifyPhoneNumber,
      RemovePhoneNumber,
      updateBanServiceHistoryStatus,
      deletePopularLocation,
      updatePopularLocation,
      updatePopularLocationStatus,
      uploadLocation,
      removeLocation,
      addPopularLocation,
      updateListStatus,
      // ListingDataUpdate,
      UpdateBlockedDates,
      // UpdateAvailableDates
      deleteBlogDetails,
      addBlogDetails,
      updateBlogDetails,
      updateBlogStatus,
      updateStaticPage,
      writeUserReview,
      updateReview,
      uploadHomeBanner,
      updateStaticInfoBlock,
      uploadStaticBlockImage,
      removeStaticBlockImages,
      updateWhyHostPage,
      updatePayoutStatus,
      updatePaymentGatewayStatus,
      createAdminRole,
      deleteAdminRole,
      createAdminUser,
      deleteAdminUser,
      removeBlockedDates,
      uploadEmailLogo,
      updateSiteSettingsLogo,
      updateClaimForHost,
      updateClaimRefund,
      updateFindYourBlock,
      updateConfigSettings,
      updateWhyHost,
      deleteWhyHostReview,
      updateWhyHostReview,
      UpdateClaimPayout,
      makeModelCsvUploader,
      payoutToHost,
      updateListingStep3,
      createMarketingBanner,
      updateMarketingBanner,
      createLanguage,
      updateLanguage,
      deleteLanguage,
      updateReservationPaymentState
    }
  })
});

export default schema;
