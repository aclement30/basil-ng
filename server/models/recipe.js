const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const ingredientSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    unit: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: null
    }
}).plugin(idValidator);

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    cookTime: {
        type: Number,
        default: null
    },
    prepTime: {
        type: Number,
        default: null
    },
    totalTime: {
        type: Number,
        default: null
    },
    recipeYield: {
        type: Number,
        default: null
    },
    image: {
        type: String,
        trim: true
    },
    ingredientsUnit: {
        type: String,
        required: true,
        default: 'imperial'
    },
    ingredients: [ingredientSchema],
    recipeInstructions: {
        type: [{
            type: String
        }]
    },
    notes: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    originalUrl: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
        }],
    },
    isDeleted: { type: Boolean, default: false }
}).plugin(idValidator);

// Return a Recipe model based upon the defined schema
module.exports = Recipe = mongoose.model('Recipe', schema);