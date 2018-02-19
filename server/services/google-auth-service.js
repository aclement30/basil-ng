const { OAuth2Client } = require('google-auth-library');
const async = require('async');

const CONFIG = require('../../config/server');
const User = require('../models/user');
const AuthService = require('./auth-service');

class GoogleAuthService extends AuthService {

  constructor() {
    super();

    this.authClient = new OAuth2Client(
      CONFIG.googleOAuth.clientID,
      CONFIG.googleOAuth.clientSecret,
    );
  }

  authenticateUserFromToken(data, callback) {
    async.waterfall([
      this.validateIdToken.bind(this, data.idToken),
      this.saveUser,
      this.createAccessToken,
    ], callback);
  }

  validateIdToken(idToken, callback) {
    if (!idToken) {
      callback('Missing provider ID token');
      return;
    }

    this.authClient.verifyIdToken(
      {
        idToken,
        audience: CONFIG.googleOAuth.clientID,
      },
      (error, loginTicket) => {
        if (error) {
          callback(error);
          return;
        }

        const payload = loginTicket.getPayload();
        const userData = {
          google: {
            id: payload.sub,
          },
          name: payload.name,
          email: payload.email
        }

        callback(error, userData);
      });
  }

  saveUser(userData, callback) {
    User.findOne({'google.id': userData.google.id}, (error, user) => {
      if (error) {
        callback(true);
      }

      if (user) {
        callback(null, user);
      } else {
        // If the user isn't in our database, create a new user
        const newUser = new User(userData);

        // Save the user
        newUser.save((err) => {
          if (err) {
            throw err;
          }

          callback(null, newUser);
        });
      }
    });
  }
}

module.exports = GoogleAuthService;
