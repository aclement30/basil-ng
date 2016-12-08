const webpackDevServer = require('./webpack-dev-server');
const apiServer = require('./api-server');

const CONFIG = require('./config/server');

const PORT = CONFIG.express.port;
const API_PORT = CONFIG.express.port - 1;
const PROD = process.env.NODE_ENV === 'production';

if (PROD) {
    apiServer(PORT);
} else {
    apiServer(API_PORT);
    webpackDevServer(PORT, API_PORT);
}
