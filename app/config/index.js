
let baseConfig = require ('./config.json');
let environmentConfig = require( './config.deploy.json');

function loadEnvironmentConfig() {
    if (process.env.NODE_ENV === 'prod') {
        return environmentConfig;
    }
}

// Perform shallow copy onto base config
let config = Object.assign({}, baseConfig, loadEnvironmentConfig());

module.exports =  config;