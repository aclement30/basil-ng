const RecipeFormatterService = require('../recipe-formatter');

module.exports = (url, document, callback) => {
    const recipeData = {};

    recipeData.title = document('title', 'head').text().replace(' | Ricardo', '').trim();
    recipeData.image = document('meta[property="og:image"]', 'head').attr('content');

    recipeData.ingredients = [];
    recipeData.recipeInstructions = [];

    document('li label', 'section.ingredients').each(function(i, elem) {
        recipeData.ingredients.push({description: document(this).text().trim()});
    });

    document('li', 'section.preparation').each(function(i, elem) {
        recipeData.recipeInstructions.push(document(this).text().trim());
    });

    RecipeFormatterService.formatRecipe(recipeData);

    callback(null, recipeData);
};