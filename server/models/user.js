const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
});

const schema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    google: googleSchema,
    isDeleted: { type: Boolean, default: false }
});

module.exports = User = mongoose.model('User', schema);
