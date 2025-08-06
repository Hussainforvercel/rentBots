require('dotenv').config();

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = 'http://localhost:3001';
export const socketUrl = process.env.SOCKET_URL || 'http://localhost:4001'
export const socketPort = process.env.SOCKET_PORT || 4001;

export const sitename = 'Your Website Name';

export const locales = ['en-US', 'es', 'it-IT', 'fr-FR', 'pt-PT', 'ar']; // default locale is the first one

export const availableListSettings = [1, 20, 3, 4, 10, 21, 13, 14, 15, 18, 19];

export const databaseUrl = process.env.DATABASE_URL;

export const coinbaseURL = process.env.COINBASE_URL;

export const fileuploadDir = process.env.FILEUPLOAD_DIR; // Listing Photos Upload Directory

export const homelogouploadDir = process.env.LOGOUPLOAD_DIR || './images/homeLogo/'; // Home Logo upload directory

export const banneruploadDir = process.env.BANNER_UPLOAD_DIR; // Home page Banner upload directory

export const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR; // User Profile Photos Upload Directory

export const documentuploadDir = process.env.DOCUMENT_UPLOAD_DIR; //Document Upload

export const locationuploadDir = process.env.LOCATION_UPLOAD_DIR; // Location upload directory

export const homebanneruploadDir = process.env.HOME_BANNER_UPLOAD_DIR; // Homepage images

export const claimImagesUploadDir = process.env.CLAIM_IMAGES_UPLOAD_DIR; // claim images

export const faviconUploadDir = process.env.FAVICON_UPLOAD_DIR; //favicon dir

export const whyHostUploadDir = process.env.WHYHOST_UPLOAD_DIR; // whyHostUploadDir	

export const logouploadDir = process.env.LOGOUPLOAD_DIR; // Logo upload directory

export const ogImageuploadDir = process.env.OGIMAGEUPLOAD_DIR; // OG Image Upload directory

export const analytics = {  // https://analytics.google.com/
  google: { trackingId: 'UA-XXXXX-X' },
};

export const googleMapAPI = '<Your API Key>';
export const googleMapServerAPI = process.env.GOOGLE_MAP_SERVER_API;

export const googleCaptcha = { sitekey: '<Your Site key>' }; // site key for google recaptcha

export const payment = {

  paypal: {
    returnURL: `${url}${process.env.PAYPAL_RETURN_URL}`,
    cancelURL: `${url}${process.env.PAYPAL_CANCEL_URL}`,
    redirectURL: {
      success: `${url}${process.env.PAYPAL_SUCCESS_REDIRECT_URL}`,
      cancel: `${url}${process.env.PAYPAL_CANCEL_URL}`
    },
    versions: {
      versionOne: '/v1',
      versionTwo: '/v2'
    },
    token_url: '/oauth2/token',
    payment_url: '/checkout/orders',
    capture_url: '/capture',
    payout_url: '/payments/payouts',
    refund: '/refund',
    refund_capture: '/payments/captures/'
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET, /* From ENV */
    publishableKey: 'pk_test_C5ukBJM7qr5P1F8dY4XKhdyp'
  }

};

export const auth = {
  jwt: { secret: process.env.JWT_SECRET },

  redirectURL: {
    login: process.env.LOGIN_URL || '/dashboard',
    verification: process.env.LOGIN_URL || '/user/verification',
    userbanned: process.env.USER_BANNED_URL || '/userbanned',
    returnURLDeletedUser: process.env.DELETE_USER_URL || '/userbanned'
  },

  facebook: { // https://developers.facebook.com/ IT IS REMOVED ON THE FUNCTIONING CODE. 
    returnURL: process.env.FACEBOOK_CLIENT_URL || `${url}/login/facebook/return`,
  },

  google: { // https://cloud.google.com/console/project
    returnURL: process.env.GOOGLE_CLIENT_URL || `${url}/login/google/return`,
  }
};

export const cronTimezone = process.env.CRON_TIMEZONE;