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
const moduleModel = require('./app/models/moduleModel/moduleModel')();
const questionSchema = require('./app/models/questionModel/questionModel')();
const assessmentModel = require('./app/models/assessmentModel/assessmentModel')();
const queryModel = require('./app/models/queryModel/queryModel')();
const assessmentMarkModel = require('./app/models/assessmentMarkModel/assessmentMarkModel')();

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
const modulesService = require('./app/data-services/modulesService/modulesService')({
    moduleModel: moduleModel,
    userModel: userModel,
    assessmentModel: assessmentModel,
    queryModel: queryModel
});

const marksService = require('./app/data-services/marksService/marksService')({
    assessmentMarkModel
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
const modulesApi = require('./app/routes/modulesApi/modulesApi')({
    modulesService: modulesService
});
const marksApi = require('./app/routes/marksApi/marksApi')({
    marksService: marksService
});

const app = express();

//Sets up response data object for use in other middleware
app.use((req, res, next) => {
    res.data = {};
    next();
})

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
app.use('/modules', authentication.authenticate, modulesApi);
app.use('/marks', authentication.authenticate, marksApi);

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