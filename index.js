// ## Index File (Javascript)
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();

// MongoDB URL from the docker-compose file
//const dbHost = 'mongodb://database/mean-docker';

//Use if running app without docker (after starting mongo manually)
const dbHost = 'mongodb://localhost:27017/time-series';

// Connect to mongodb
mongoose.connect(dbHost);

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

// Testing using cross origin (remove later)
var cors = require('cors');
app.use(cors());

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