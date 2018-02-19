const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const schema = new mongoose.Schema({
  id: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  expiration: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  isDeleted: { type: Boolean, default: false }
}).plugin(idValidator);

module.exports = AuthToken = mongoose.model('AuthToken', schema);
