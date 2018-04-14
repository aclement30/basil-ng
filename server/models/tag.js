const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name_fr: {
    type: String,
    default: null
  },
  name_en: {
    type: String,
    default: null
  },
  alias: {
    type: String,
    default: null
  },
  isDeleted: { type: Boolean, default: false }
});

module.exports = Tag = mongoose.model('Tag', schema);
