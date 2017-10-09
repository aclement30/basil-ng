var server = {
    express: {
        port: process.env.BASIL_API_PORT || 3000
    },

    db: process.env.BASIL_MONGODB_URI || 'mongodb://localhost/basil',

    googleOAuth: {
        clientID: process.env.BASIL_GOOGLE_CLIENT_ID || "658336000281-fqdbd6gagun6lkevhnnrujapvob7uecv.apps.googleusercontent.com",
        clientSecret: process.env.BASIL_GOOGLE_CLIENT_SECRET || "zie2QotGknGvQWSzdIxoR5P0",
        callbackURL: process.env.BASIL_GOOGLE_CALLBACK_URL || "http://localhost:4200/auth/google/callback"
    },

    ingredientParser: {
        source: 'client/js/ingredient.grammar.peg'
    },

    ocrApi: {
        url: 'https://api.ocr.space/parse/image',
        apiKey: process.env.BASIL_OCR_API_KEY,
    },

    sessionSecretKey: process.env.BASIL_SESSION_KEY || "TopSecretSessionKey",

    defaultGroup: process.env.BASIL_DEFAULT_GROUP
};

module.exports = server;
