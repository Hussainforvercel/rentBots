import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import requestLanguage from 'express-request-language';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import models, { PayoutMegasoft, SiteSettings,Listing, User, UserProfile, ListingData,EmailTemplate,PaymentGuide, Reservation } from './data/models';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { renderToStringWithData } from 'react-apollo';
import PrettyError from 'pretty-error';
import { IntlProvider } from 'react-intl';
import router from './router';
import axios from 'axios';
import xml2js from 'xml2js'
import './serverIntlPolyfill';
import createApolloClient from './core/createApolloClient';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './core/passport';
import schema from './data/schema';
import routes from './routes';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved

import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';

import { setLocale } from './actions/intl';
import { loadAccount } from './actions/account';

import { port, auth, locales } from './config';

// Social Media Authentication
import facebookAuth from './core/auth/facebook';
import googleAuth from './core/auth/google';

import { setSiteSettings } from './actions/siteSettings';

// Currency Rates Action
import { getCurrencyRates } from './actions/getCurrencyRates';
import { getCurrenciesData } from './actions/getCurrencies';

// Service Fees Action
import { getServiceFees } from './actions/ServiceFees/getServiceFees';
import { getHomeData } from './actions/Home/getHomeData';

// File Upload
import fileUpload from './core/fileUpload';
import documentUpload from './core/documentUpload';
import logoUpload from './core/logoUpload';
import homeLogoUpload from './core/homeLogoUpload'
import locationUpload from './core/locationUpload';
import profilePhotoUpload from './core/profilePhotoUpload';
import bannerUpload from './core/bannerUpload';
import downloadRoute from './core/download/downloadRoute';
import csvRoutes from './core/csv/csvRoutes';
import homeBannerUpload from './core/homeBannerUpload';
import favIconUpload from './core/favIconUpload';
import whyHostUpload from './core/whyHostUpload';
import languageFileUpload from './core/languageFileUpload';
import languageRoutes from './core/languageRoutes';

// For Emails
import sendEmail from './core/email/emailSetup';

// Payment Gateway
import paypalRoutes from './core/payment/paypal';
import payoutRoutes from './core/payment/payout/payoutRoutes';
import refundRoutes from './core/payment/refund/refundRoutes';

// CRON Jobs
import cron from './core/cron/cron';
import reservationExpire from './core/cron/reservationExpire';
import reservationComplete from './core/cron/reservationComplete';
import reservationReview from './core/cron/reservationReview';
import updateListStatus from './core/cron/updateListStatus';
import calendarPriceUpdate from './core/cron/calendarPriceUpdate';
import autoPayouToHost from './core/cron/autoPayoutToHost';
import autoClaimPayoutToHost from './core/cron/autoClaimPayoutToHost';

// iCal Routes
import iCalRoutes from './core/iCal/iCalRoutes';
import iCalCron from './core/iCal/iCalCron';
import exportICalRoutes from './core/iCal/exportIcal/exportRoutes';

// Stripe
import stripePayment from './core/payment/stripe/stripePayment';
import stripeRefund from './core/payment/stripe/stripeRefund';
import stripePayout from './core/payment/stripe/stripePayout';
import stripeAddPayout from './core/payment/stripe/stripeAddPayout';

// Twilio SMS
import TwilioSms from './core/sms/twilio/sendSms';

// Mobile API helper routes
import mobileRoutes from './core/mobileRoutes';
import uploadListPhotoMobile from './core/uploadListPhotoMobile';

// Site Map
import sitemapRoutes from './core/sitemap/sitemapRoutes';

import pushNotificationRoutes from './core/pushNotifications/pushNotificationRoutes';

import { getAdminUser } from './actions/siteadmin/AdminUser/manageAdminUser';
import { getPrivileges } from './actions/siteadmin/AdminRoles/manageAdminRoles';
import claimImagesUpload from './core/claimImagesUpload';
import deepLinkBundle from './core/deepLinkBundle';
import ogImageUpload from './core/ogImageUpload';
import expiredUserLogin from './core/cron/expiredUserLogin';

import updatePayoutTransactionId from './core/updateTransactionId';
import PayoutMegasoftDetails from './data/models/PayoutMegasoftDetails';
import Language from './data/models/siteadmin/Language';
import fs from 'fs';
import { Op } from 'sequelize';
import moment from 'moment';

// import { socketRoutes } from './core/socket/socketRoutes';
// import sendSocketNotification from './core/socket/sendSocketNotification';

const app = express();
app.use(compression());

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
if (typeof global.navigator === 'undefined') {
  const mockNavigator = {
    userAgent: 'all',
    appVersion: '1.0.0',
    platform: 'Node.js',
    vendor: 'Node.js',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: true,
    onLine: true,
    doNotTrack: null,
    hardwareConcurrency: 1,
    maxTouchPoints: 0,
    oscpu: undefined,
    product: 'Node.js',
    productSub: '1.0.0',
    vendorSub: '',
    getBattery: () => Promise.resolve({}),
    javaEnabled: () => false,
    sendBeacon: () => false,
    taintEnabled: () => false,
    vibrate: () => false
  };

  Object.defineProperty(global, 'navigator', {
    value: mockNavigator,
    writable: true,
    configurable: true
  });
}

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/.well-known', express.static(path.join(__dirname, '../well-known/pki-validation')));
app.use(cookieParser());
app.use(requestLanguage({
  languages: locales,
  queryName: 'lang',
  cookie: {
    name: 'lang',
    options: {
      path: '/',
      maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
    },
    url: '/lang/{language}',
  },
}));

app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

//
// Authentication
// -----------------------------------------------------------------------------
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.clearCookie('id_token');
    res.status(401).redirect('/');
  }
});
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}

//Socket Routes
// socketRoutes(app);

// Authentication
// facebookAuth(app);
// googleAuth(app);

// File Upload
fileUpload(app);

//doucment upload
documentUpload(app);

logoUpload(app);
homeLogoUpload(app)
homeBannerUpload(app)
locationUpload(app);
profilePhotoUpload(app);
favIconUpload(app);
claimImagesUpload(app);
bannerUpload(app);
whyHostUpload(app);
languageFileUpload(app);
languageRoutes(app);
ogImageUpload(app);

// Profile Photo upload from social media
downloadRoute(app);

// For Export CSV files
csvRoutes(app);

// Send Email Function
sendEmail(app);

// Payment Gateway
paypalRoutes(app);
payoutRoutes(app);
refundRoutes(app);

// Ensure models are properly initialized before use
let isModelsInitialized = false;

const initializeModels = async () => {
  if (!isModelsInitialized) {
    try {
      await models.sync();
      isModelsInitialized = true;
    } catch (err) {
      console.error('Error initializing models:', err);
      throw err;
    }
  }
};


app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });


app.put('/api/payout-megasoft-details/:userId', async (req, res) => {
  try {
    await initializeModels();
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format - must be a valid positive number'
      });
    }
    const payoutDetails = await PayoutMegasoftDetails.findOne({
      where: { userId: userIdNum }
    });
    if (!payoutDetails) {
      return res.status(404).json({
        success: false,
        error: 'Payout details not found for this user'
      });
    }
    // Update fields from request body
    const fields = [
      'accountType', 'firstName', 'lastName', 'accountName', 'confirmAccountName',
      'nationalId', 'bankName', 'pagoMovilPhone', 'status'
    ];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        payoutDetails[field] = req.body[field];
      }
    });
    await payoutDetails.save();
    return res.status(200).json({
      success: true,
      data: payoutDetails
    });
  } catch (error) {
    console.error('Error updating Megasoft payout details:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/payout-megasoft-details/:userId', async (req, res) => {
  try {
    await initializeModels();
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format - must be a valid positive number'
      });
    }
    const payoutDetails = await PayoutMegasoftDetails.findOne({
      where: { userId: userIdNum }
    });
    if (!payoutDetails) {
      return res.status(404).json({
        success: false,
        error: 'Payout details not found for this user'
      });
    }
    return res.status(200).json({
      success: true,
      data: payoutDetails
    });
  } catch (error) {
    console.error('Error fetching Megasoft payout details:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.get('/api/site-settings/button-color', async (req, res) => {
  try {
    await initializeModels();
    const setting = await SiteSettings.findOne({ where: { name: 'ButtonColor' } });
    if (!setting) {
      return res.status(404).json({ success: false, error: 'ButtonColor setting not found' });
    }
    return res.status(200).json({ success: true, value: setting.value });
  } catch (error) {
    console.error('Error fetching ButtonColor setting:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Language.findAll({
      attributes: ['id', 'title', 'code', 'fileURL']
    });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching languages', error: error.message });
  }
});
app.get('/api/list-reservations', async (req, res) => {
  try {
    const { listId } = req.query;
    
    if (!listId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing listId parameter' 
      });
    }

    // Get all approved and pending reservations for this listing
    const reservations = await Reservation.findAll({
      where: {
        listId,
       
      },
      attributes: [
        'id',
        'checkIn',
        'checkOut',
        'startTime',
        'endTime',
        'isHourly',
        'reservationState'
      ],
      order: [['checkIn', 'ASC']]
    });

    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => {
      if (!date || isNaN(new Date(date))) return null; // Handle invalid or null dates
      return new Date(date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    return res.json({
      success: true,
      reservations: reservations.map(reservation => ({
        checkIn: formatDate(reservation.checkIn),
        checkOut: formatDate(reservation.checkOut),
        startTime: reservation.startTime || 0,
        isHourly: reservation.isHourly ,
        endTime: reservation.endTime || 0,
        reservationState: reservation.reservationState
      }))
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
app.post('/admin/update-language-file', async (req, res) => {
  const { code, messages } = req.body;
  if (!code || !messages) {
      return res.status(400).json({ error: 'Missing code or messages' });
  }
  
  try {
      const filePath = path.join(__dirname, 'messages', `${code}.json`);
      
      // Ensure directory exists
      const messagesDir = path.join(__dirname, 'messages');
      if (!fs.existsSync(messagesDir)) {
          fs.mkdirSync(messagesDir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
      
      // Return the saved data directly
      res.json({ 
          success: true, 
          messages: messages // Return the data that was just saved
      });
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});
app.get('/admin/get-language-file', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  
  const filePath = path.join(__dirname, 'messages', `${code}.json`);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${code}.json` });
    }
    
    const data = await fs.promises.readFile(filePath, 'utf8');
    const json = JSON.parse(data);
    res.json({ success: true, messages: json });
  } catch (err) {
    console.error('Error reading language file:', err);
    res.status(500).json({ error: err.message });
  }
});
// Add this temporary debug endpoint
app.get('/admin/debug-messages-dir', (req, res) => {
  const messagesDir = path.join(__dirname, 'messages');
  
  try {
    console.log('Messages directory path:', messagesDir);
    console.log('Directory exists?', fs.existsSync(messagesDir));
    
    if (fs.existsSync(messagesDir)) {
      const files = fs.readdirSync(messagesDir);
      console.log('Files in directory:', files);
      res.json({ 
        success: true, 
        directory: messagesDir,
        exists: true,
        files: files 
      });
    } else {
      res.json({ 
        success: false, 
        directory: messagesDir,
        exists: false,
        message: 'Directory does not exist'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/pay-with-megasoft', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const {
      amount,
      pan,                
      cvv2,                
      cid,                
      expdate,           
      client,
      listId              
    } = req.body;

    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    console.log('Received payment request:', {
      amount,
      pan,
      cvv2,
      cid,
      expdate,
      client
    });

    // First, get the control 
    const tokenXmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();
    const authString = `${settings.username || "blackpearl"}:${settings.password || "Caracas123.1"}`;
    const authBase64 = Buffer.from(authString).toString('base64');
    
    const tokenResponse = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', tokenXmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${authBase64 || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
    console.log('Token Response:', tokenResponse.data);
    
    const parsedToken = await xml2js.parseStringPromise(tokenResponse.data);
    const control = parsedToken.response.control[0]; 

    // Format amount to ensure it's a valid number with 2 decimal places
    const formattedAmount = Number(amount).toFixed(2);
    console.log('Original Amount:', amount);
    console.log('Formatted Amount:', formattedAmount);

    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20250527'}</cod_afiliacion>
      <control>${control}</control>
      <transcode>0141</transcode>
      <pan>${pan}</pan>
      <cvv2>${cvv2}</cvv2>
      <cid>${cid}</cid>
      <expdate>${expdate}</expdate>
      <amount>${formattedAmount}</amount>
      <client>${client}</client>
      <factura>BP1749413361922</factura>
    </request>
    `.trim();

    console.log('Payment Request XML:', xmlBody);

    const paymentResponse = await axios.post('https://paytest.megasoft.com.ve/payment/action/v2-procesar-compra', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${authBase64 || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });

    console.log('Payment Response:', paymentResponse.data);
    
    const parsedPayment = await xml2js.parseStringPromise(paymentResponse.data);
    const codigo = parsedPayment.response.codigo[0];
    const descripcion = parsedPayment.response.descripcion[0];

    if (codigo !== '00') {
      return res.status(400).json({
        success: false,
        error: descripcion,
        control: parsedPayment.response.control[0]
      });
    }

    // Create PayoutMegasoft entry for credit card payment
    await PayoutMegasoft.create({
      method: 'CREDIT_CARD',
      payoutAmount: amount,
      buyerId: listId,
      isAmountTransfer: false
    });

    parsedPayment.response.originalAmount = amount;

    return res.status(200).json({
      success: true,
      data: parsedPayment.response
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

app.post('/api/pay-with-megasoft-Zelle', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const {
      amount,
      cid,                
      codigobancoComercio,                
      referencia,
      listId                
    } = req.body;

    // Get Megasoft credentials from site settings
    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    const tokenXmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();

    const tokenResponse = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', tokenXmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
    console.log(tokenResponse.data,"res-token")
    const parsedToken = await xml2js.parseStringPromise(tokenResponse.data);
    const control = parsedToken.response.control[0]; 
    const formattedAmount = Number(amount).toFixed(2);
    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
      <control>${control}</control>
      <cid>${cid}</cid>
      <codigobancoComercio>${codigobancoComercio}</codigobancoComercio>
      <referencia>${referencia}</referencia>
      <amount>${formattedAmount}</amount>
      <factura>BP1749413361922</factura>
    </request>
    `.trim();
    console.log("testingData:", xmlBody,amount,formattedAmount)

    const paymentResponse = await axios.post('https://paytest.megasoft.com.ve/payment/action/v2-procesar-compra-zelle', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
     const parsedPayment = await xml2js.parseStringPromise(paymentResponse.data);
    const codigo = parsedPayment.response.codigo[0];
    const descripcion = parsedPayment.response.descripcion[0];

    if (codigo !== '00') {
      return res.status(400).json({
        success: false,
        error: descripcion,
        control: parsedPayment.response.control[0]
      });
    }

    // Create PayoutMegasoft entry for Zelle payment
    await PayoutMegasoft.create({
      method: 'ZELLE',
      payoutAmount: (Number(formattedAmount) / 100).toFixed(2),
      buyerId: listId,
      isAmountTransfer: false
    });

    return res.status(200).json({
      success: true,
      data: parsedPayment.response
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

app.post('/api/pay-with-megasoft-pogo', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const {
      codigobancoComercio,                
      amount,                
      telefonoCliente,
      codigobancoCliente,
      telefonoComercio,
      listId
    } = req.body;

    // Get Megasoft credentials from site settings
    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    const tokenXmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();

    const tokenResponse = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', tokenXmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
    console.log(tokenResponse.data,"res-token")
    const parsedToken = await xml2js.parseStringPromise(tokenResponse.data);
    const control = parsedToken.response.control[0]; 
    const formattedAmount = Number(amount).toFixed(2);
    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
      <control>${control}</control>
      <telefonoCliente>${telefonoCliente}</telefonoCliente>
      <codigobancoCliente>${codigobancoCliente}</codigobancoCliente>
      <telefonoComercio>${telefonoComercio}</telefonoComercio>
      <codigobancoComercio>${codigobancoComercio}</codigobancoComercio>
      <amount>${formattedAmount}</amount>
      <factura>BP1749413361922</factura>
    </request>
    `.trim();

    const paymentResponse = await axios.post('https://paytest.megasoft.com.ve/payment/action/v2-procesar-compra-p2c', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
     const parsedPayment = await xml2js.parseStringPromise(paymentResponse.data);
    const codigo = parsedPayment.response.codigo[0];
    const descripcion = parsedPayment.response.descripcion[0];

    if (codigo !== '00') {
      return res.status(400).json({
        success: false,
        error: descripcion,
        control: parsedPayment.response.control[0]
      });
    }

    // Create PayoutMegasoft entry for P2C payment
    await PayoutMegasoft.create({
      method: 'P2C',
      payoutAmount: amount,
      buyerId: listId,
      isAmountTransfer: false
    });

    return res.status(200).json({
      success: true,
      data: parsedPayment.response
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

app.get('/api/megasoft-token', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    // Get Megasoft credentials from site settings
    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();

    const response = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });
   return res.status(200).json({ success: true, data: response.data });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

// Cron Job
cron(app);
reservationExpire(app);
reservationComplete(app);
reservationReview(app);
updateListStatus(app);
calendarPriceUpdate(app);
autoPayouToHost(app);
autoClaimPayoutToHost(app);

// iCal
iCalRoutes(app);
iCalCron(app);
exportICalRoutes(app);

// Stripe
stripePayment(app);
stripeRefund(app);
stripePayout(app);
stripeAddPayout(app);

// Twilio -SMS
TwilioSms(app);

// Mobile API helper routes
mobileRoutes(app);
uploadListPhotoMobile(app);

// Site Map
sitemapRoutes(app, routes);
pushNotificationRoutes(app);
deepLinkBundle(app);

// UserLogin Expiry cron
expiredUserLogin(app);

updatePayoutTransactionId(app);

app.post('/logout', function (req, res) {
  // let userId = req.user.id;
  res.clearCookie('id_token');
  res.redirect('/');
  // sendSocketNotification(`userlogout-${userId}`, '')
});

app.post('/admin-logout', function (req, res) {
  // let adminId = req.user.id;
  res.clearCookie('id_token');
  res.redirect('/siteadmin/login');
  // sendSocketNotification(`adminUserLogout-${adminId}`, '')
});

// PayoutMegasoft API Routes
app.get('/api/payout-megasoft', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();
    
    const { 
      page = 1, 
      limit = 10, 
      method, 
      isAmountTransfer,
      startDate,
      endDate,
      buyerId 
    } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    
    if (method) {
      whereClause.method = method;
    }
    
    if (isAmountTransfer !== undefined) {
      whereClause.isAmountTransfer = isAmountTransfer === 'true';
    }
    
    if (buyerId) {
      whereClause.buyerId = buyerId;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await PayoutMegasoft.count({ where: whereClause });

    // Get PayoutMegasoft records with pagination
    const payouts = await PayoutMegasoft.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get unique buyer IDs to fetch listing data
    const buyerIds = [...new Set(payouts.map(payout => payout.buyerId))];
    
    // Fetch listing data for all buyer IDs
    const listings = await Listing.findAll({
      where: {
        id: buyerIds
      },
      include: [
        {
          model:User,
          as: 'user',
          include: [
            {
              model: UserProfile,
              as: 'profile'
            }
          ]
        },
        {
          model: ListingData,
          as: 'listingData'
        }
      ]
    });

    // Create a map of listing data for quick lookup
    const listingMap = {};
    listings.forEach(listing => {
      listingMap[listing.id] = listing;
    });

    // Format the response data
    const formattedPayouts = payouts.map(payout => {
      const listing = listingMap[payout.buyerId];
      
      return {
        id: payout.id,
        method: payout.method,
        payoutAmount: payout.payoutAmount,
        buyerId: payout.buyerId,
        isAmountTransfer: payout.isAmountTransfer,
        createdAt: payout.createdAt,
        updatedAt: payout.updatedAt,
        listing: listing ? {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          city: listing.city,
          state: listing.state,
          country: listing.country,
          isPublished: listing.isPublished,
          coverPhoto: listing.coverPhoto,
          user: listing.user ? {
            id: listing.user.id,
            email: listing.user.email,
            type: listing.user.type,
            profile: listing.user.profile ? {
              firstName: listing.user.profile.firstName,
              lastName: listing.user.profile.lastName,
              displayName: listing.user.profile.displayName,
              picture: listing.user.profile.picture,
              phoneNumber: listing.user.profile.phoneNumber
            } : null
          } : null,
          listingData: listing.listingData ? {
            basePrice: listing.listingData.basePrice,
            currency: listing.listingData.currency,
            securityDeposit: listing.listingData.securityDeposit
          } : null
        } : null
      };
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      data: {
        payouts: formattedPayouts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching PayoutMegasoft records:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/admin/payment-guides', async (req, res) => {
  try {
    await initializeModels();
    const guides = await PaymentGuide.findAll();
    res.json({ success: true, data: guides });
  } catch (error) {
    console.error('Error fetching payment guides:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/payment-guides/:id', async (req, res) => {
  try {
    await initializeModels();
    const { id } = req.params;
    const { number, name, message } = req.body;
    const guide = await PaymentGuide.findById(id);
    if (!guide) {
      return res.status(404).json({ success: false, error: 'PaymentGuide not found' });
    }
    await guide.update({ number, name, message });
    res.json({ success: true, data: guide });
  } catch (error) {
    console.error('Error updating payment guide:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get('/api/payout-megasoft/:id', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const { id } = req.params;

    const payoutRecord = await PayoutMegasoft.findById(id);

    if (!payoutRecord) {
      return res.status(404).json({
        success: false,
        error: 'PayoutMegasoft record not found'
      });
    }

    // Fetch listing data separately using buyerId
    const listing = await Listing.findOne({
      where: {
        id: payoutRecord.buyerId
      },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: UserProfile,
              as: 'profile'
            }
          ]
        },
        {
          model: ListingData,
          as: 'listingData'
        }
      ]
    });
    console.log('User Profile:', listing?.user?.profile.profileId);
    // Fetch PayoutMegasoftDetails for the listing owner
    const payoutDetails = listing?.user?.profile.profileId ? await PayoutMegasoftDetails.findOne({
      where: {
        userId: listing?.user?.profile.profileId
      }
    }) : null;
    // Format the response data
    const formattedPayout = {
      id: payoutRecord.id,
      method: payoutRecord.method,
      payoutAmount: payoutRecord.payoutAmount,
      buyerId: payoutRecord.buyerId,
      isAmountTransfer: payoutRecord.isAmountTransfer,
      createdAt: payoutRecord.createdAt,
      updatedAt: payoutRecord.updatedAt,
      listing: listing ? {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        city: listing.city,
        state: listing.state,
        country: listing.country,
        isPublished: listing.isPublished,
        coverPhoto: listing.coverPhoto,
        user: listing.user ? {
          id: listing.user.id,
          email: listing.user.email,
          type: listing.user.type,
          profile: listing.user.profile ? {
            firstName: listing.user.profile.firstName,
            lastName: listing.user.profile.lastName,
            displayName: listing.user.profile.displayName,
            picture: listing.user.profile.picture,
            phoneNumber: listing.user.profile.phoneNumber
          } : null,
          payoutDetails: payoutDetails ? {
            id: payoutDetails.id,
            accountType: payoutDetails.accountType,
            firstName: payoutDetails.firstName,
            lastName: payoutDetails.lastName,
            accountName: payoutDetails.accountName,
            nationalId: payoutDetails.nationalId,
            bankName: payoutDetails.bankName,
            pagoMovilPhone: payoutDetails.pagoMovilPhone,
            status: payoutDetails.status,
            createdAt: payoutDetails.createdAt,
            updatedAt: payoutDetails.updatedAt
          } : null
        } : null,
        listingData: listing.listingData ? {
          basePrice: listing.listingData.basePrice,
          currency: listing.listingData.currency,
          securityDeposit: listing.listingData.securityDeposit
        } : null
      } : null
    };

    return res.status(200).json({
      success: true,
      data: formattedPayout
    });

  } catch (error) {
    console.error('Error fetching PayoutMegasoft record:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/payout-megasoft-stats', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const { startDate, endDate } = req.query;

    // Build where clause for date filtering
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [models.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Get total count
    const statsTotalCount = await PayoutMegasoft.count({ where: whereClause });

    // Get count by method
    const methodStats = await PayoutMegasoft.findAll({
      where: whereClause,
      attributes: [
        'method',
        [models.Sequelize.fn('COUNT', models.Sequelize.col('id')), 'count'],
        [models.Sequelize.fn('SUM', models.Sequelize.cast(models.Sequelize.col('payoutAmount'), 'DECIMAL(10,2)')), 'totalAmount']
      ],
      group: ['method'],
      raw: true
    });

    // Get total amount
    const statsTotalAmount = await PayoutMegasoft.sum('payoutAmount', { 
      where: whereClause,
      raw: true 
    });

    // Get count by transfer status
    const transferStats = await PayoutMegasoft.findAll({
      where: whereClause,
      attributes: [
        'isAmountTransfer',
        [models.Sequelize.fn('COUNT', models.Sequelize.col('id')), 'count']
      ],
      group: ['isAmountTransfer'],
      raw: true
    });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await PayoutMegasoft.count({
      where: {
        ...whereClause,
        createdAt: {
          [models.Sequelize.Op.gte]: sevenDaysAgo
        }
      }
    });

    // Format the response
    const stats = {
      totalCount: statsTotalCount,
      totalAmount: statsTotalAmount || 0,
      methodBreakdown: methodStats.map(stat => ({
        method: stat.method,
        count: parseInt(stat.count),
        totalAmount: parseFloat(stat.totalAmount) || 0
      })),
      transferBreakdown: transferStats.map(stat => ({
        isAmountTransfer: stat.isAmountTransfer,
        count: parseInt(stat.count)
      })),
      recentActivity: {
        last7Days: recentActivity
      }
    };

    return res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching PayoutMegasoft statistics:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT API to mark a PayoutMegasoft transaction as completed
app.put('/api/payout-megasoft/:id/complete', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const { id } = req.params;

    const payout = await PayoutMegasoft.findById(id);

    if (!payout) {
      return res.status(404).json({
        success: false,
        error: 'PayoutMegasoft record not found'
      });
    }

    // Update the payout to mark it as transferred
    await payout.update({
      isAmountTransfer: true
    });

    return res.status(200).json({
      success: true,
      message: 'Transaction marked as completed successfully',
      data: {
        id: payout.id,
        method: payout.method,
        payoutAmount: payout.payoutAmount,
        buyerId: payout.buyerId,
        isAmountTransfer: payout.isAmountTransfer,
        updatedAt: payout.updatedAt
      }
    });

  } catch (error) {
    console.error('Error completing PayoutMegasoft transaction:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

//
// Register API middleware
// -----------------------------------------------------------------------------

// Email Template API Endpoints
app.get('/api/admin/email-templates', async (req, res) => {
  try {
    const templates = await EmailTemplate.findAll({ 
      attributes: ['id', 'name', 'subject', 'content'],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

app.get('/api/admin/email-templates/:id', async (req, res) => {
  try {
    const template = await EmailTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email template not found' 
      });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    console.error('Error fetching email template:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});

app.put('/api/admin/email-templates/:id', async (req, res) => {
  try {
    const { subject, content } = req.body;
    const template = await EmailTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email template not found'
      });
    }
    
    await template.update({
      subject,
      content
    });
    
    res.json({ success: true, data: template });
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error'
    });
  }
});



const graphqlMiddleware = expressGraphQL((req, res) => ({
  schema,
  graphiql: __DEV__,
  rootValue: {
    request: req,
    response: res
  },
  pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    const store = configureStore({
      user: req.user || null,
    }, {
      cookie: req.headers.cookie,
      apolloClient,
    });

    let baseCurrency = req.cookies.currency;

    // Start Site Settings - Move this to the top
    await store.dispatch(setSiteSettings());

    // Currency Rates
    await store.dispatch(getCurrencyRates(baseCurrency));

    // Get Available Currencies
    await store.dispatch(getCurrenciesData());

    // Get Service Fees
    await store.dispatch(getServiceFees());
    await store.dispatch(getHomeData());

    // Admin Login
    if (req.user != null && req.user != undefined && req.user.admin == true) {
      store.dispatch(setRuntimeVariable({
        name: 'isAdminAuthenticated',
        value: true,
      }));
      await store.dispatch(getPrivileges());
      await store.dispatch(getAdminUser());
    }

    // User Login
    if (req.user != null && req.user != undefined && req.user.admin != true) {
      store.dispatch(setRuntimeVariable({
        name: 'isAuthenticated',
        value: req.user ? true : false,
      }));
      await store.dispatch(loadAccount());
    }

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    store.dispatch(setRuntimeVariable({
      name: 'availableLocales',
      value: locales,
    }));

    const locale = req.language;
    const intl = await store.dispatch(setLocale({
      locale,
    }));

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Initialize a new Redux store
      // http://redux.js.org/docs/basics/UsageWithReact.html
      store,
      // Apollo Client for use with react-apollo
      client: apolloClient,
      pathname: req.path,
      query: req.query,
      locale,
      intl
    };

    const route = await router.resolve(context);

    let currentLocation = req.path;
    let collectionArray = ['/message/', '/users/trips/itinerary/', '/review/write/'];

    if (!req.user) {
      collectionArray && collectionArray.length > 0 && collectionArray.map((value, index) => {
        if (currentLocation.includes(value)) {
          if (req.url) {
            res.redirect("/login?refer=" + currentLocation);
            return;
          } else {
            res.redirect('/login');
            return;
          }
        }
      });
    }

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = await renderToStringWithData(<App locale={locale} context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.state = context.store.getState();
    data.scripts = [assets["vendors~polyfills"].js];
    data.scripts.push(assets.client.js);
    data.lang = locale;
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const locale = req.language;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
      lang={locale}
    >
      {ReactDOM.renderToString(
        <IntlProvider locale={locale}>
          <ErrorPageWithoutStyle error={err} />
        </IntlProvider>,
      )}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
initializeModels().then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
}).catch(err => {
  console.error('Failed to initialize models:', err);
  process.exit(1);
});
/* eslint-enable no-console */
console.log('Server')

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/pay-with-megasoft-creditoinmediato', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const {
      cid,
      cuentaOrigen,
      telefonoOrigen,
      codigobancoOrigen,
      cuentaDestino,
      amount,
      listId
    } = req.body;

    // Fetch Megasoft credentials from SiteSettings
    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    const tokenXmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();

    const tokenResponse = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', tokenXmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });

    const parsedToken = await xml2js.parseStringPromise(tokenResponse.data);
    const control = parsedToken.response.control[0]; 
    
    const formattedAmount = Number(amount).toFixed(2);
    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
      <control>${control}</control>
      <cid>${cid}</cid>
      <cuentaOrigen>${cuentaOrigen}</cuentaOrigen>
      <telefonoOrigen>${telefonoOrigen}</telefonoOrigen>
      <codigobancoOrigen>${codigobancoOrigen}</codigobancoOrigen>
      <cuentaDestino>${cuentaDestino}</cuentaDestino>
      <amount>${formattedAmount}</amount>
      <factura>BP1749413361922</factura>
    </request>
    `.trim();

    const paymentResponse = await axios.post('https://paytest.megasoft.com.ve/payment/action/v2-procesar-compra-creditoinmediato', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });

    const parsedPayment = await xml2js.parseStringPromise(paymentResponse.data);
    const codigo = parsedPayment.response.codigo[0];
    const descripcion = parsedPayment.response.descripcion[0];

    if (codigo !== '00') {
      return res.status(400).json({
        success: false,
        error: descripcion,
        control: parsedPayment.response.control[0]
      });
    }

    // Create PayoutMegasoft entry for Debit payment
    await PayoutMegasoft.create({
      method: 'DEBIT',
      payoutAmount: amount,
      buyerId: listId,
      isAmountTransfer: false
    });

    return res.status(200).json({
      success: true,
      data: parsedPayment.response
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});


app.post('/api/pay-with-megasoft-c2p', async (req, res) => {
  try {
    // Initialize models before use
    await initializeModels();

    const {
      amount,
      cid,
      telefono,
      codigobanco,
      codigoc2p,
      listId
    } = req.body;

    const megasoftSettings = await SiteSettings.findAll({
      where: {
        name: {
          in: ['username', 'password', 'Token', 'merchentID']
        }
      }
    });

    const settings = {};
    megasoftSettings.forEach(setting => {
      settings[setting.name] = setting.value;
    });

    const tokenXmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
    </request>
    `.trim();

    const tokenResponse = await axios.post('https://paytest.megasoft.com.ve/action/v2-preregistro', tokenXmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });

    const parsedToken = await xml2js.parseStringPromise(tokenResponse.data);
    const control = parsedToken.response.control[0]; 

    const formattedAmount = Number(amount).toFixed(2);
    const xmlBody = `
    <request>
      <cod_afiliacion>${settings.merchentID || '20241118'}</cod_afiliacion>
      <control>${control}</control>
      <cid>${cid}</cid>
      <telefono>${telefono}</telefono>
      <codigobanco>${codigobanco}</codigobanco>
      <codigoc2p>${codigoc2p}</codigoc2p>
      <amount>${formattedAmount}</amount>
      <factura>BP1749413361922</factura>
    </request>
    `.trim();

    const paymentResponse = await axios.post('https://paytest.megasoft.com.ve/payment/action/v2-procesar-compra-c2p', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${settings.Token || 'YWRhc2lsdmE6TTNnYXNvZnQh'}`
      },
      auth: {
        username: settings.username || "blackpearl",
        password: settings.password || "Caracas123.1"
      },
      timeout: 10000
    });

    const parsedPayment = await xml2js.parseStringPromise(paymentResponse.data);
    const codigo = parsedPayment.response.codigo[0];
    const descripcion = parsedPayment.response.descripcion[0];

    if (codigo !== '00') {
      return res.status(400).json({
        success: false,
        error: descripcion,
        control: parsedPayment.response.control[0]
      });
    }

    // Create PayoutMegasoft entry for C2P payment
    await PayoutMegasoft.create({
      method: 'C2P',
      payoutAmount: amount,
      buyerId: listId,
      isAmountTransfer: false
    });

    return res.status(200).json({
      success: true,
      data: parsedPayment.response
    });

  } catch (error) {
    const errMsg = error?.response?.data || error.message;
    console.error('Megasoft Error:', errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

app.post('/api/send-voucher-details', async (req, res) => {
  try {
    const { email, voucherData } = req.body;
    
    // Extract amount from voucher array
    const extractAmount = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return null;
      
      const montoLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('MONTO_BS')
      );
      
      if (montoLine) {
        const amountMatch = montoLine.match(/MONTO_BS\.__:([\d,]+)_/);
        if (amountMatch && amountMatch[1]) {
          return amountMatch[1].replace(',', '.');
        }
      }
      return null;
    };

    // Extract date from voucher array
    const extractDate = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return null;
      
      const fechaLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('FECHA:')
      );
      
      if (fechaLine) {
        const dateMatch = fechaLine.match(/FECHA:(\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}:\d{2})_/);
        if (dateMatch && dateMatch[1]) {
          return dateMatch[1].replace('_', ' ');
        }
      }
      return null;
    };

    // Extract transaction ID from voucher array
    const extractTransactionId = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return voucherData?.control?.[0] || 'N/A';
      
      const refLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('REF:')
      );
      
      if (refLine) {
        const refMatch = refLine.match(/REF:(\d+)_/);
        if (refMatch && refMatch[1]) {
          return refMatch[1];
        }
      }
      return voucherData?.control?.[0] || 'N/A';
    };

    // Extract approval code from voucher array
    const extractApprovalCode = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return null;
      
      const aprobLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('APROB:')
      );
      
      if (aprobLine) {
        const aprobMatch = aprobLine.match(/APROB:(\d+)_/);
        if (aprobMatch && aprobMatch[1]) {
          return aprobMatch[1];
        }
      }
      return null;
    };

    // Extract card number from voucher array
    const extractCardNumber = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return null;
      
      const ctaLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('NRO.CTA:')
      );
      
      if (ctaLine) {
        const ctaMatch = ctaLine.match(/NRO.CTA:([^*]+)\*\*\*\*\*\*(\d+)_/);
        if (ctaMatch && ctaMatch[1] && ctaMatch[2]) {
          return `${ctaMatch[1]}******${ctaMatch[2]}`;
        }
      }
      return null;
    };

    // Extract sequence number from voucher array
    const extractSequence = (voucherData) => {
      if (!voucherData?.voucher?.[0]?.linea) return null;
      
      const secLine = voucherData.voucher[0].linea.find(line => 
        typeof line === 'string' && line.includes('SECUENCIA:')
      );
      
      if (secLine) {
        const secMatch = secLine.match(/SECUENCIA:(\d+)_/);
        if (secMatch && secMatch[1]) {
          return secMatch[1];
        }
      }
      return null;
    };

    // Format the voucher data for the email
    const formattedVoucherData = {
      transactionId: extractTransactionId(voucherData),
      amount: extractAmount(voucherData) || '0.00',
      date: extractDate(voucherData) || 'N/A',
      status: voucherData.descripcion?.[0] || 'Approved',
      description: voucherData.descripcion?.[0] || 'N/A',
      approvalCode: extractApprovalCode(voucherData) || 'N/A',
      cardNumber: extractCardNumber(voucherData) || 'N/A',
      sequence: extractSequence(voucherData) || 'N/A',
      siteName: 'Rental System'
    };

    console.log('Sending email with voucher data:', formattedVoucherData);
    
    // Use the existing sendEmail function
    const { status, response } = await sendEmail(email, 'paymentVoucher', formattedVoucherData);

    if (status === 200) {
      return res.status(200).json({
        success: true,
        message: 'Voucher details sent successfully'
      });
    } else {
      console.error('Email sending failed:', response);
      return res.status(400).json({
        success: false,
        error: response
      });
    }

  } catch (error) {
    console.error('Error sending voucher details:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST API to submit Megasoft payout details
app.post('/api/payout-megasoft-details', async (req, res) => {
  try {
    await initializeModels();

    const {
      accountType,
      firstName,
      lastName,
      accountName,
      userId,
      confirmAccountName,
      nationalId,
      bankName,
      pagoMovilPhone,
      listId
    } = req.body;

    // Get user ID from the request body instead of req.user
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Validate that userId is a valid number (profileId)
    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format - must be a valid positive number'
      });
    }

    // Check if user profile exists using the numeric ID
    const userProfileExists = await UserProfile.findOne({
      where: { profileId: userIdNum }
    });
    if (!userProfileExists) {
      return res.status(400).json({
        success: false,
        error: 'User profile not found'
      });
    }

    if (!accountType || !firstName || !lastName || !accountName ) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate account name match
    
    // Check if details already exist for this user
    const existingDetails = await PayoutMegasoftDetails.findOne({
      where: { userId }
    });

    if (existingDetails) {
      return res.status(400).json({
        success: false,
        error: 'Payout details already exist for this user'
      });
    }

    const payoutDetails = await PayoutMegasoftDetails.create({
      userId: userIdNum,
      accountType,
      firstName,
      lastName,
      accountName,
      confirmAccountName,
      nationalId,
      bankName,
      pagoMovilPhone,
      status: 'pending'
    });

    return res.status(200).json({
      success: true,
      message: 'Payout details submitted successfully',
      data: {
        id: payoutDetails.id,
        userId: payoutDetails.userId,
        accountType: payoutDetails.accountType,
        firstName: payoutDetails.firstName,
        lastName: payoutDetails.lastName,
        accountName: payoutDetails.accountName,
        status: payoutDetails.status,
        createdAt: payoutDetails.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting Megasoft payout details:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});





// API endpoint to get all languages

app.use('/messages', express.static(path.join(__dirname, 'messages')));



