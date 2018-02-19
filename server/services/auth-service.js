const Jwt = require('jsonwebtoken');

const CONFIG = require('../../config/server');
const AuthToken = require('../models/authToken');

class AuthService {

  authenticateUserFromToken(data, callback) {
    throw Error('AuthService.authenticateUserFromToken() is not implemented');
  }

  saveUser(userData, callback) {
    throw Error('AuthService.saveUser() is not implemented');
  }

  createAccessToken(user, callback) {
    const accessToken = Jwt.sign(
      { id: user._id },
      CONFIG.sessionSecretKey,
      {
        expiresIn: 86400 // expires in 24 hours
      },
    );

    const refreshToken = Jwt.sign(
      { id: user._id },
      CONFIG.sessionSecretKey,
      {
        expiresIn: 604800 // expires in 7 days
      },
    );

    const expiration = Math.floor(Date.now() / 1000) + (3600 * 24);
    const authToken = new AuthToken({
      user: user,
      accessToken,
      refreshToken,
      expiration,  // Token expires in 24 hours
    });

    authToken.save((err) => {
      if (err) {
        throw err;
      }

      callback(null, { accessToken, refreshToken, expiration });
    });
  }
}

module.exports = AuthService;
