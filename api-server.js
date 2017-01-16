const async = require('async');
const bodyParser = require('body-parser');
const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');

// -------------------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------------------

const CONFIG = require('./config/server');

// -------------------------------------------------------------------------
// CONTROLLERS
// -------------------------------------------------------------------------

const authController = require('./server/controllers/authController');
const recipeController = require('./server/controllers/recipeController');

// -------------------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------------------

const AuthService = require('./server/services/auth');

// -------------------------------------------------------------------------
// EXPRESS SETUP
// -------------------------------------------------------------------------

const PROD = process.env.NODE_ENV === 'production';

module.exports = (PORT) => {
    // Create an express instance
    const app = express();

    // Configure session & Passport auth
    app.use(expressSession({
        secret: CONFIG.sessionSecretKey,
        name: 'basil',
        resave: true,
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
    recipeController.init(app);

    // -------------------------------------------------------------------------

    // app.all('*', (req, res) => {
    //     res.sendFile('public/index.html', { root: __dirname });
    // });

    async.series([
        (callback) => {
            // DB setup
            mongoose.connect(CONFIG.db, callback);
        },
        (callback) => {
            // Fire it up (start our server)
            app.listen(PORT, (error) => {
                process.stdout.write(`\x1b[32mExpress server listening on port ${PORT}\x1b[0m`);
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
};