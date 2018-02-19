const AuthToken = require('../models/authToken');
const User = require('../models/user');

class UserService {

  async getUser(id) {
    return await User.findOne({ _id: id });
  }

  async findByToken(accessToken) {
    const minExpiration = Math.floor(Date.now() / 1000);
    const authToken = await AuthToken.findOne({ accessToken, expiration: { $gte: minExpiration } });

    if (!authToken) {
      return false;
    }

    return this.getUser(authToken.user);
  }

  createUser(user, callback) {
    // Save the user
    user.save((err) => {
      if (err) {
        throw err;
      }

      callback(null, user);
    });
  }
}

module.exports = new UserService();
