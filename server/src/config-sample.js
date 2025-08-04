require('dotenv').config();

/* eslint-disable max-len */

export const port = process.env.PORT || 4000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = process.env.SITE_URL;
export const sitename = process.env.SITENAME;
export const environment = process.env.environment || false;
export const websiteUrl = process.env.WEBSITE_URL;
export const socketPort = process.env.SOCKET_PORT || 4001;

export const databaseConfig = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT || "mysql"
}

export const auth = { jwt: { secret: process.env.JWT_SECRET || 'Rent ALL' } };

export const googleMapAPI = 'AIzaSyD6BzBn_Tszpy0STtNSbtyyBp4ii2Ji55c';

export const payment = {
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