
import baseConfig from './config.json';
import environmentConfig from './config.deploy.json';

function loadEnvironmentConfig() {
    if (window.location.host.indexOf('localhost') === -1) {
        return environmentConfig;
    }
}

// Perform shallow copy onto base config
let config = Object.assign({}, baseConfig, loadEnvironmentConfig());

export default config;