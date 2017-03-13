const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    isDeleted: { type: Boolean, default: false }
});

module.exports = Tag = mongoose.model('Tag', schema);