const Strategy = require('passport-http-bearer').Strategy;
const UserService = require('./services/user');

module.exports = new Strategy(
  async function(accessToken, callback) {
    const user = await UserService.findByToken(accessToken);
    callback(null, user);
  }
);
