// ## Index File (Javascript)
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const router = express.Router();

// Connect to mongodb and set promise library to global library
mongoose.Promise = require('bluebird');
mongoose.connect(config.get('database.host'));

//Get utilities
const crypto = require('./app/utilities/crypto/crypto')();
const mailer = require('./app/utilities/mailer/mailer')();

// Get our data layer
const userModel = require('./app/models/userModel/userModel')({
    crypto: crypto
});

//Get our business layer
//services

//data-services
const emailService = require('./app/data-services/emailService/emailService')({
    mailer: mailer
});

const usersService = require('./app/data-services/usersService/usersService')({
    userModel: userModel,
    crypto: crypto
});

// Get our API layer
const authentication = require('./app/services/authentication/authentication')({
    crypto: crypto
});
const accountApi = require('./app/routes/accountApi/accountApi')({
    emailService: emailService,
    usersService: usersService,
    authentication: authentication
});
const usersApi = require('./app/routes/usersApi/usersApi')({
    usersService: usersService,
    authentication: authentication
});

const app = express();

// Adds cross origin support between client and server
app.use(cors());

//Sets up response data object for use in other middleware
app.use((req, res, next) => {
    res.data = {};
    next();
})

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set our api routes
app.use('/users',  usersApi);
app.use('/account',  accountApi);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));