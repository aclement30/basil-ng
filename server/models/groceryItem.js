const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const schema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: null
    },
    unit: {
        type: String,
        default: null
    },
    position: {
        type: Number,
        default: null
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false }
}).plugin(idValidator);

// Return a GroceryItem model based upon the defined schema
module.exports = Recipe = mongoose.model('GroceryItem', schema);