const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const schema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    multiplier: {
        type: Number,
        default: 1
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    started: {
        type: Date,
        default: Date.now
    },
    isCooking: { type: Boolean, default: true }
});

schema.plugin(idValidator);

// Return a CookingRecipe model based upon the defined schema
module.exports = Recipe = mongoose.model('CookingRecipe', schema);