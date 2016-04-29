var server = {
    express: {
        port: process.env.PORT || 5000
    },

    db: process.env.MONGODB_URI || 'mongodb://localhost/basil',

    googleOAuth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    sessionSecretKey: process.env.SESSION_KEY,

    defaultGroup: process.env.DEFAULT_GROUP
};

module.exports = server;