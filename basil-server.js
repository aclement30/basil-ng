const async = require('async');
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const mongoDBStore = require('connect-mongodb-session')(expressSession);
const passport = require('passport');

// -------------------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------------------

// Load .env configuration file into process.env
require('dotenv').config();

const CONFIG = require('./config/server');

const cookieStore = new mongoDBStore({
    uri: CONFIG.db,
    collection: 'sessions',
});

// Catch errors
cookieStore.on('error', (error) => {
    assert.ifError(error);
    assert.ok(false);
});

// -------------------------------------------------------------------------
// CONTROLLERS
// -------------------------------------------------------------------------

const authController = require('./server/controllers/authController');
const cookingRecipeController = require('./server/controllers/cookingRecipeController');
const groceryController = require('./server/controllers/groceryController');
const importController = require('./server/controllers/importController');
const ingredientController = require('./server/controllers/ingredientController');
const instructionController = require('./server/controllers/instructionController');
const recipeController = require('./server/controllers/recipeController');
const tagController = require('./server/controllers/tagController');

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------

const AuthService = require('./server/services/auth');

// -------------------------------------------------------------------------
// EXPRESS SETUP
// -------------------------------------------------------------------------

const PROD = process.env.NODE_ENV === 'production';

// Create an express instance
const app = express();

// Configure session & Passport auth
app.use(expressSession({
    secret: CONFIG.sessionSecretKey,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    name: 'basil',
    rolling: true,
    resave: true,
    store: cookieStore,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Setup Passport for authentication
AuthService.setup(passport);

// Disable etag headers on responses
app.disable('etag');

// Set /public as our static content dir
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({'extended': 'true'}));           // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// -------------------------------------------------------------------------
// EXPRESS ROUTING
// -------------------------------------------------------------------------

authController.init(app, passport);
cookingRecipeController.init(app);
groceryController.init(app);
importController.init(app);
ingredientController.init(app);
instructionController.init(app);
recipeController.init(app);
tagController.init(app);

// -------------------------------------------------------------------------

async.series([
    (callback) => {
        // DB setup
        mongoose.connect(CONFIG.db, callback);
    },
    (callback) => {
        // Fire it up (start our server)
        app.listen(CONFIG.express.port, (error) => {
            process.stdout.write(`\x1b[32mExpress server listening on port ${CONFIG.express.port}\x1b[0m`);
            callback(error);
        });
    },
], (error) => {
    if (error) {
        if (error.name == 'MongoError') {
            process.stderr.write(`\x1b[31mMongoDB error: ${error.message}\x1b[0m`);
        } else {
            process.stderr.write(`\x1b[31mExpress error: ${error.message}\x1b[0m`);
        }
        process.exit(1);
    }

    if (PROD) {
        app.get('*', function(req, res) {
            res.sendFile('public/index.html', { root: __dirname });
        });
    }
});