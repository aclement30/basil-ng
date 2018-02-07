const User = require('../models/user');

class UserService {

  getUser(id, callback) {
    User.findOne({ _id: id }).exec((error, user) => {
      callback(error, user);
    });
  }
}

module.exports = new UserService();
