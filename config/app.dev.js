module.exports = {
    _BASIL_API_AI_: JSON.stringify({
        url: 'https://api.api.ai/v1',
        version: '20150910',
        accessToken: process.env.BASIL_API_AI_ACCESS_TOKEN,
    }),
    _BASIL_GOOGLE_CLIENT_ID_: JSON.stringify(process.env.BASIL_GOOGLE_CLIENT_ID),
};
