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

    ingredientParser: {
        source: 'client/js/ingredient.grammar.peg'
    },

    ocrApi: {
        url: 'https://api.ocr.space/parse/image',
        apiKey: process.env.OCR_API_KEY,
    },

    sessionSecretKey: process.env.SESSION_KEY,

    defaultGroup: process.env.DEFAULT_GROUP
};

module.exports = server;