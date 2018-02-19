const authorize = require('../middlewares/authorization');
const ImportService = require('../services/import.js');

class ImportController {

  constructor(app) {
    // Configure routes
    app.post('/api/recipes/import', authorize, this.importRecipe);
  }

  importRecipe(req, res) {
    const recipeUrl = req.body.url;

    ImportService.parseUrl(recipeUrl, (error, recipe) => {
      if (error) {
        res.status(400).send({
          url: recipeUrl,
          errorMessage: error,
        });
        return;
      }

      recipe.originalUrl = recipeUrl;

      res.send({
        url: recipeUrl,
        recipe,
      });
    });
  }
}

module.exports = function(expressApp) {
  return new ImportController(expressApp);
};
