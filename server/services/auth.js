const GoogleStrategy = require('passport-google-oauth20').Strategy;
const refresh = require('passport-oauth2-refresh');
const User = require('../models/user');

const config = require('../../config/server');

const strategy = new GoogleStrategy(
    // Config
    config.googleOAuth,
    (accessToken, refreshToken, profile, done) => {

        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(() => {

            // Try to find the user based on their Google id
            User.findOne({ 'google.id' : profile.id }, (error, user) => {
                if (error) {
                    return done('oauth-error');
                }

                if (user) {
                    if (refreshToken) {
                        /// TO BE REMOVED
                        // Update user credentials in DB
                        user.google.accessToken = accessToken;
                        user.google.refreshToken = refreshToken;

                        user.save((error) => {
                            // If a user is found, log them in
                            done(error, user);
                        });
                    } else {
                        done(error, user);
                    }
                } else {
                    // If the user isn't in our database, create a new user
                    const newUser = new User({
                        google: {
                            id: profile.id,
                            accessToken,
                            refreshToken,
                        },
                        name: profile.displayName,
                        email: profile.emails[0].value // User's first email
                    });

                    // Save the user
                    newUser.save((err) => {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }
);

module.exports = {
    setup: (passport) => {

        // Serialize user for the session
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        // Deserialize the user
        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });


        // -------------------------------------------------------------------------
        // GOOGLE STRATEGY
        // -------------------------------------------------------------------------

        passport.use('google', strategy);
        refresh.use(strategy);
    },

    // Express middleware to validate user authentication on protected routes
    check: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.status(401).send();
        }
    },

    validateRefreshToken: (req, res, next) => {
        User.findOne({'google.refreshToken': req.body.token}, (error, user) => {
            if (error) {
                return next(error);
            }

            req.user = user;
            next();
        });
    },

    generateAccessToken: (req, res, next) => {
        refresh.requestNewAccessToken('google', req.user.google.refreshToken, (error, accessToken) => {
            if (error) {
                return next(error);
            }

            res.accessToken = accessToken;

            req.user.google.accessToken = accessToken;
            req.user.save((error) => {
                next(error, accessToken);
            });
        });
    }
};
