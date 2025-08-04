import express from 'express';
import expressJwt from 'express-jwt';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import jwt from 'jsonwebtoken'; // Add this import
import { auth, port, environment } from './config.js';
import schema from './data/schema.js';

import pushNotificationRoutes from './libs/pushNotificationRoutes.js';
// Remove this import since we're redefining it
// import { verifyJWTToken } from './libs/auth.js';
import paypalRoutes from './libs/payment/paypal/paypal.js';
import sequelize from './data/sequelize.js';

import './data/models/ModalAssociaton.js';

const app = express();
const __DEV__ = environment;

// Add header size limit middleware first
app.use((req, res, next) => {
    req.connection.setMaxListeners(0);
    next();
});

// Configure compression with threshold
app.use(compression({
    threshold: 0,
    level: 6
}));

// Middlewares with increased limits
app.use(cookieParser(auth.jwt.secret, {
    // Cookie parser options
    maxAge: 86400000, // 1 day in milliseconds
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb', parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '5mb' }));
// Add express.json limit too
app.use(express.json({ limit: '5mb' }));

// Add CORS headers with larger limits
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, authToken');
    // Add headers to handle CORS properly 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Updated middleware pattern for verifyJWTToken - defined in server.js
function verifyJWTToken(req, res, next) {
    // Skip verification if no token or if already verified by express-jwt
    if (!req.headers.authToken || req.user) {
        return next();
    }

    const token = req.headers.authToken;

    if (typeof token !== 'string') {
        return next(); // Skip if not a string
    }

    jwt.verify(token, auth.jwt.secret, (err, decodedToken) => {
        if (err || !decodedToken) {
            // Continue without setting user
            return next();
        }

        req.user = decodedToken;
        next();
    });
}

// JWT middleware with expressJwt
app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    algorithms: ["HS256"],
    getToken: req => req.headers.authToken,
}));

// Add a timeout increase for large requests
app.use((req, res, next) => {
    req.setTimeout(120000); // 2 minutes
    res.setTimeout(120000);
    next();
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send({
            status: 400,
            errorMessage: 'Invalid auth token provided.'
        });
        next();
    } else {
        next(err); // Pass other errors to next middleware
    }
});

app.use(verifyJWTToken);

if (__DEV__) {
    app.enable('trust proxy');
}

// Add a specific handler for 431 errors
app.use((err, req, res, next) => {
    if (err.status === 431 || err.statusCode === 431) {
        console.error('Header too large error:', err);
        res.status(431).send('Request header fields too large. Please clear your cookies and try again.');
    } else {
        next(err);
    }
});

pushNotificationRoutes(app);
paypalRoutes(app);

// Express GraphQL with increased limits
app.use(
    '/graphql',
    expressGraphQL((req, res) => ({
        schema,
        graphiql: __DEV__,
        pretty: __DEV__,
        rootValue: {
            request: req,
            response: res
        }
    }))
);
// Error Handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Test database connection before starting the server
sequelize
    .authenticate()
    .then(() => {
        console.log('✓ Database connection has been established successfully.');

        // Server launch after successful database connection
        sequelize.sync().catch(err => console.log(err.stack)).then(() => {
            // Set server-wide header limits when creating the server
            const server = app.listen(port, () =>
                console.log(`Server ready at http://localhost:${port}`),
            );

            // Increase server header limits
            server.maxHeadersCount = 100; // Increase from default
            server.timeout = 120000; // 2 minutes timeout
        });
    })
    .catch(err => {
        console.error('✗ Unable to connect to the database:', err);
        console.error('Please check your database configuration and ensure the database server is running.');
    });