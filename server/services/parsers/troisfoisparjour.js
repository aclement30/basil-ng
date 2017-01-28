const RecipeFormatterService = require('../recipe-formatter');

module.exports = (url, document, callback) => {
    const recipeData = {};

    recipeData.title = document('meta[property="og:title"]', 'head').attr('content');
    recipeData.image = document('meta[property="og:image"]', 'head').attr('content');

    recipeData.ingredients = [];
    recipeData.recipeInstructions = [];

    document('[itemprop=ingredients] > span').each(function(i, elem) {
        recipeData.ingredients.push({description: document(this).text().trim()});
    });

    document('li', '[itemprop=recipeInstructions]').each(function(i, elem) {
        recipeData.recipeInstructions.push(document(this).text().trim());
    });

    RecipeFormatterService.formatRecipe(recipeData);

    callback(null, recipeData);
};