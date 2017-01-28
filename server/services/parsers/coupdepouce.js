const RecipeFormatterService = require('../recipe-formatter');

module.exports = (url, document, callback) => {
    const recipeData = {};

    recipeData.title = document('meta[property="og:title"]', 'head').attr('content').replace(' | Recettes du Québec', '').trim();
    recipeData.image = document('meta[property="og:image"]', 'head').attr('content');

    recipeData.ingredients = [];
    recipeData.recipeInstructions = [];

    let recipeDocument = document('.recipe-content').first();
    recipeDocument.find('section.ingredients > ul li').each(function(i, elem) {
        let ingredient = document(this).text().trim();
        ingredient = ingredient.replace(/([\n\s])+/g, " ");
        recipeData.ingredients.push({ description: ingredient });
    });

    recipeDocument.find('section.method p').each(function(i, elem) {
        recipeData.recipeInstructions.push(document(this).text().trim());
    });

    RecipeFormatterService.formatRecipe(recipeData);

    callback(null, recipeData);
};