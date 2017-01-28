const RecipeFormatterService = require('../recipe-formatter');

module.exports = (url, document, callback) => {
    const recipeData = {};

    recipeData.title = document('meta[property="og:title"]', 'head').attr('content').replace(' | Recettes du Québec', '').trim();
    recipeData.image = document('meta[property="og:image"]', 'head').attr('content');

    recipeData.ingredients = [];
    recipeData.recipeInstructions = [];

    let recipeDocument = document('.recipe-content').first();
    recipeDocument.find('section.ingredients li').each(function(i, elem) {
        recipeData.ingredients.push({ description: document(this).text() });
    });

    recipeDocument.find('section.method p').each(function(i, elem) {
        recipeData.recipeInstructions.push(document(this).text().trim());
    });

    RecipeFormatterService.formatRecipe(recipeData);

    callback(null, recipeData);
};