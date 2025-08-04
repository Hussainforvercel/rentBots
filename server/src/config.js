// config.js - ES Module version
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
const url = process.env.SITE_URL;
const sitename = process.env.SITENAME;
const environment = process.env.environment || false;
const websiteUrl = process.env.WEBSITE_URL;
const socketPort = process.env.SOCKET_PORT || 4001;

const databaseConfig = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT || "mysql"
};

const auth = { jwt: { secret: process.env.JWT_SECRET || 'Rent ALL' } };

const googleMapAPI = process.env.GOOGLE_API || 'AIzaSyD_BoCvQzQkYX4PglO-tg8pAdghaIEpahk';

const payment = {
  stripe: { secretKey: process.env.STRIPE_SECRET },
  paypal: {
    returnURL: `${url}${process.env.PAYPAL_RETURN_URL}`,
    cancelURL: `${url}${process.env.PAYPAL_CANCEL_URL}`,
    versions: {
      versionOne: '/v1',
      versionTwo: '/v2'
    },
    token_url: '/oauth2/token',
    payment_url: '/checkout/orders',
    capture_url: '/capture',
  },
};

export {
  port,
  host,
  url,
  sitename,
  environment,
  websiteUrl,
  socketPort,
  databaseConfig,
  auth,
  googleMapAPI,
  payment
};

// If you need a default export as well
export default {
  port,
  host,
  url,
  sitename,
  environment,
  websiteUrl,
  socketPort,
  databaseConfig,
  auth,
  googleMapAPI,
  payment
};