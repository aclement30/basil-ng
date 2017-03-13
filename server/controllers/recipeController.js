const Recipe = require('../models/recipe');
const RecipeService = require('../services/recipe');
const errorHandler = require('../errorHandler');
const requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/recipes/:recipeId', requireAuth, (req, res) => {
        const recipeId = req.params.recipeId;
        if (!recipeId) {
            errorHandler.client("Missing recipe ID", res);

            return;
        }

        RecipeService.getRecipe(req.user, recipeId, (error, recipe) => {
            res.send(recipe);
        });
    });

    app.get('/api/recipes', requireAuth, (req, res) => {
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

        RecipeService.getRecipes(req.user, { offset, limit }, (error, recipes) => {
            res.header('X-Total-Count', recipes.count);
            res.send(recipes);
        });
    });

    app.post('/api/recipes', requireAuth, (req, res) => {
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
    });

    app.put('/api/recipes/:recipeId', requireAuth, (req, res) => {
        const recipeId = req.params.recipeId;
        const data = req.body;

        if (!recipeId || recipeId == 'undefined') {
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
    });

    app.delete('/api/recipes/:recipeId', requireAuth, (req, res) => {
        const recipeId = req.params.recipeId;

        RecipeService.deleteRecipe(req.user, recipeId, (error) => {
            if (!error) {
                res.sendStatus(200);
            } else {
                errorHandler.server('Recipe could not be deleted', res);
            }
        });
    });
}

module.exports.init = init;