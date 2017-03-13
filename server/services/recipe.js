const Recipe = require('../models/recipe');

class RecipeService {

    getRecipe(user, id, callback) {
        Recipe.findOne({_id: id, user: user._id}).exec((error, recipe) => {
            callback(error, recipe);
        });
    }

    getRecipes(user, pagination, callback) {
        const limit = pagination && pagination.limit || 100;
        const offset = pagination && pagination.offset || 0;

        let recipes = [];

        Recipe.count({ isDeleted: false, user: user._id }).exec((countError, count) => {
            recipes.count = count;

            Recipe.find({ isDeleted: false, user: user._id }).skip(offset).limit(limit).sort({ date: -1 }).exec((error, userRecipes) => {
                recipes = recipes.concat(userRecipes);

                callback(error, recipes);
            });
        });
    }

    createRecipe(recipeData, user, callback) {
        const recipe = new Recipe(recipeData);
        recipe.user = user._id;

        recipe.save((error) => {
            callback(error, recipe);
        });
    }

    updateRecipe(id, recipeData, user, callback) {
        Recipe.findOne({ _id: id, user: user._id }, (err, recipe) => {
            if (err) {
                callback(err);
            }

            recipe.title = recipeData.title;
            recipe.ingredients = recipeData.ingredients;
            recipe.recipeInstructions = recipeData.recipeInstructions;
            recipe.cookTime = recipeData.cookTime ? parseInt(recipeData.cookTime) : null;
            recipe.prepTime = recipeData.prepTime ? parseInt(recipeData.prepTime) : null;
            recipe.totalTime = recipeData.cookTime || recipeData.prepTime ? parseInt(recipeData.cookTime) + parseInt(recipeData.prepTime) : null;
            recipe.recipeYield = recipeData.recipeYield ? parseInt(recipeData.recipeYield) : null;
            recipe.recipeYield = recipeData.recipeYield ? parseInt(recipeData.recipeYield) : null;
            recipe.image = recipeData.image;
            recipe.originalUrl = recipeData.originalUrl;
            recipe.notes = recipeData.notes;
            recipe.tags = recipeData.tags;

            recipe.save((error) => {
                callback(error, recipe);
            });
        });
    }

    deleteRecipe(user, id, callback) {
        Recipe.update({ _id: id, user: user._id }, { $set: { isDeleted: true } }, (error) => {
            callback(error);
        });
    }
}

module.exports = new RecipeService();