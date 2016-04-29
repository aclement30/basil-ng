var mongoose = require('mongoose'),
    idValidator = require('mongoose-id-validator');

var ingredientSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});
ingredientSchema.plugin(idValidator);

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    cookTime: {
        type: Number,
        default: 0
    },
    prepTime: {
        type: Number,
        default: 0
    },
    totalTime: {
        type: Number,
        default: 0
    },
    recipeYield: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ingredientsUnit: {
        type: String,
        required: true
    },
    /*ingredients: {
        type: [{
            type: ingredientSchema
        }]
    },*/
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
    created: {
        type: Date,
        default: Date.now
    },
    isDeleted: { type: Boolean, default: false }
});

schema.plugin(idValidator);

// Return a Recipe model based upon the defined schema
module.exports = Recipe = mongoose.model('Recipe', schema);