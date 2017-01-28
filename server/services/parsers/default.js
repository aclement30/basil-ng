const RecipeFormatterService = require('../recipe-formatter');

module.exports = (url, document, callback) => {
    const recipeData = {};

    let title;
    if (document('meta[property="og:title"]', 'head').length) {
        title = document('meta[property="og:title"]', 'head').attr('content').trim();
    }
    if ((!title || title === '') && document('title', 'head').length) {
        title = document('title', 'head').text().trim();
    }

    if (title && title !== '') {
        recipeData.title = title;
    }

    if (document('meta[property="og:image"]', 'head').length) {
        recipeData.image = document('meta[property="og:image"]', 'head').attr('content');
    }

    recipeData.ingredients = [];
    recipeData.recipeInstructions = [];

    let ingredients = [];
    document('[itemprop=ingredients]').each(function(i, elem) {
        ingredients.push({ description: document(this).text().trim() });
    });

    if (!ingredients.length) {
        document('li', '.ingredients').each(function(i, elem) {
            ingredients.push({ description: document(this).text().trim() });
        });
    }

    if (ingredients.length) {
        recipeData.ingredients = ingredients;
    }

    let recipeInstructions = [];
    document('[itemprop=recipeInstructions]').each(function(i, elem) {
        recipeInstructions.push(document(this).text().trim());
    });

    if (recipeInstructions.length) {
        recipeData.recipeInstructions = recipeInstructions;
    }

    // Abort if there is not at least 1 ingredient and 1 instruction found
    if (!recipeData.ingredients.length || !recipeData.recipeInstructions.length) {
        return callback('La recette n\'a pas pu être importée automatiquement');
    }

    RecipeFormatterService.formatRecipe(recipeData);

    callback(null, recipeData);
};