// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// MongoDB URL from the docker-compose file
//const dbHost = 'mongodb://database/mean-docker';

//Use if running app without docker (after starting mongo manually)
const dbHost = 'mongodb://localhost:27017/time-series';

// Connect to mongodb
mongoose.connect(dbHost);

// Get our data layer
const userModel = require('./app/models/userModel');

//Get our business layer
const usersService = require('./app/data-services/usersService')({
    userModel: userModel
})

// Get our API layer
const usersApi = require('./app/routes/usersApi')({
    usersService: usersService
});

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set our api routes
app.use('/', usersApi);

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