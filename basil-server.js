const async = require('async');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const passport = require('passport');
const authStrategy = require('./server/authStrategy');

// -------------------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------------------

// Load .env configuration file into process.env
require('dotenv').config();

const CONFIG = require('./config/server');

// -------------------------------------------------------------------------
// EXPRESS SETUP
// -------------------------------------------------------------------------

const PROD = process.env.NODE_ENV === 'production';

// Create an express instance
const app = express();

// Disable etag headers on responses
app.disable('etag');

// Authenticate user with access token
passport.use(authStrategy);

// Serve compressed (.gz) files
app.use(compression());

// Set /dist as our static content dir
app.use(express.static(__dirname + '/dist'));

app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// -------------------------------------------------------------------------
// CONTROLLERS ROUTING
// -------------------------------------------------------------------------

const authController = require('./server/controllers/authController')(app);
const cookingRecipeController = require('./server/controllers/cookingRecipeController')(app);
const groceryController = require('./server/controllers/groceryController')(app);
const importController = require('./server/controllers/importController')(app);
const ingredientController = require('./server/controllers/ingredientController')(app);
const instructionController = require('./server/controllers/instructionController')(app);
const recipeController = require('./server/controllers/recipeController')(app);
const tagController = require('./server/controllers/tagController')(app);

// -------------------------------------------------------------------------

async.series([
    (callback) => {
        // DB setup
        mongoose.connect(CONFIG.db, callback);
    },
    (callback) => {
        // Fire it up (start our server)
        app.listen(CONFIG.express.port, (error) => {
            process.stdout.write(`\x1b[32mExpress server listening on port ${CONFIG.express.port}\x1b[0m` + '\n');
            callback(error);
        });
    },
], (error) => {
    if (error) {
        if (error.name == 'MongoError') {
            process.stderr.write(`\x1b[31mMongoDB error: ${error.message}\x1b[0m` + '\n');
        } else {
            process.stderr.write(`\x1b[31mExpress error: ${error.message}\x1b[0m` + '\n');
        }
        process.exit(1);
    }

    if (PROD) {
        app.get('*', function(req, res) {
            res.sendFile('dist/index.html', { root: __dirname });
        });
    }
});
