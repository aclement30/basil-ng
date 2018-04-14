const RecipeService = require('../services/recipe');
const UserService = require('../services/user');
const errorHandler = require('../errorHandler');
const authorize = require('../middlewares/authorization');

class RecipeController {

  constructor(app) {
    // Configure routes
    app.get('/api/recipes/:recipeId', this.getRecipe);
    app.get('/api/recipes', this.getRecipes);
    app.post('/api/recipes', authorize, this.createRecipe);
    app.put('/api/recipes/:recipeId', authorize, this.updateRecipe);
    app.delete('/api/recipes/:recipeId', authorize, this.removeRecipe);
  }

  getRecipe(req, res) {
    const recipeId = req.params.recipeId;
    if (!recipeId) {
      errorHandler.client("Missing recipe ID", res);

      return;
    }

    RecipeService.getRecipe(recipeId, (error, recipe) => {
      res.send(recipe);
    });
  }

  async getRecipes(req, res) {
    let limit = Number(req.query.limit) || 100;
    if (limit < 1 || limit > 500) {
      limit = 100;
    }
    let page = Number(req.query.page) || 1;
    if (page < 1) {
      page = 1;
    }
    const offset = (page - 1) * limit;

    res.header('X-Page', page);

    const params = {
      pagination: { offset, limit },
    }

    // User ID is required because we don't authenticate user on this route
    if (req.query.userId) {
      params.user = await UserService.getUser(req.query.userId)
    } else {
      errorHandler.client("Missing user ID", res);

      return;
    }

    RecipeService.getRecipes(params, (error, recipes) => {
      res.header('X-Total-Count', recipes.count);
      res.send(recipes);
    });
  }

  createRecipe(req, res) {
    const data = req.body;

    // Construct a new Recipe object
    const recipeData = {
      title: data['title'],
      ingredients: data['ingredients'],
      recipeInstructions: data['recipeInstructions'],
      cookTime: data['cookTime'] ? parseInt(data['cookTime']) : null,
      prepTime: data['prepTime'] ? parseInt(data['prepTime']) : null,
      totalTime: data['cookTime'] || data['prepTime'] ? parseInt(data['cookTime']) + parseInt(data['prepTime']) : null,
      recipeYield: data['recipeYield'] ? parseInt(data['recipeYield']) : null,
      image: data['image'],
      originalUrl: data['originalUrl'],
      notes: data['notes'],
      tags: data['tags'],
    };

    RecipeService.createRecipe(recipeData, req.user, (error, recipe) => {
      if (!error) {
        res.status(201).send(recipe);
      } else {
        errorHandler.client(error, res);
      }
    });
  }

  updateRecipe(req, res) {
    const recipeId = req.params.recipeId;
    const data = req.body;

    if (!recipeId) {
      errorHandler.client("Missing recipe ID", res);

      return;
    }

    RecipeService.updateRecipe(recipeId, data, req.user, (error, recipe) => {
      if (!error) {
        res.send(recipe);
      } else {
        errorHandler.client(error, res);
      }
    });
  }

  removeRecipe(req, res) {
    const recipeId = req.params.recipeId;

    RecipeService.deleteRecipe(req.user, recipeId, (error) => {
      if (!error) {
        res.sendStatus(204);
      } else {
        errorHandler.server('Recipe could not be deleted', res);
      }
    });
  }
}

module.exports = function(expressApp) {
  return new RecipeController(expressApp);
};
