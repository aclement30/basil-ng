const CookingRecipe = require('../models/cookingRecipe');
const Recipe = require('../models/recipe');
const errorHandler = require('../errorHandler');
const requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/cookingRecipes', requireAuth, (req, res) => {
        if (req.user) {
            CookingRecipe.find({ isCooking: true, user: req.user._id }).exec((error, cookingRecipes) => {
                let cookingRecipeIds = cookingRecipes.reduce((ids, object) => {
                    ids.push(object.recipe);
                    return ids;
                }, []);

                Recipe.find({ isDeleted: false, _id: { $in: cookingRecipeIds } }).exec((err, recipes) => {
                    let flattenRecipes = recipes.map((recipe) => {
                        const cookingRecipe = cookingRecipes.find(listRecipe => (String(listRecipe.recipe) === String(recipe._id)));

                        return {
                            _id: recipe._id,
                            title: recipe.title,
                            image: recipe.image,
                            started: cookingRecipe.started,
                            multiplier: cookingRecipe.multiplier,
                        };
                    });

                    res.send(flattenRecipes);
                });
            });
        } else {
            res.status(403).send();
        }
    });

    app.patch('/api/cookingRecipes/:recipeId/startCooking', requireAuth, (req, res) => {
        const recipeId = req.params.recipeId;
        const multiplier = req.body.multiplier;

        if (req.user) {
            CookingRecipe.findOne({ recipe: recipeId, user: req.user._id }).exec((error, cookingRecipe) => {
                if (cookingRecipe) {
                    CookingRecipe.update({ _id: cookingRecipe._id }, { $set: { isCooking: true, multiplier } }, (err) => {
                        if (!err) {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    // Create a new model instance with our object
                    const cookingRecipe = new CookingRecipe({
                        recipe: recipeId,
                        multiplier,
                        user: req.user,
                    });

                    cookingRecipe.save((error) => {
                        if (!error) {
                            res.sendStatus(200);
                        } else {
                            errorHandler.client(error, res);
                        }
                    });
                }
            });
        } else {
            res.status(403).send();
        }
    });

    app.patch('/api/cookingRecipes/:recipeId/servings', requireAuth, (req, res) => {
        const recipeId = req.params.recipeId;
        const multiplier = req.body.multiplier;

        if (req.user) {
            CookingRecipe.findOne({ recipe: recipeId, user: req.user._id }).exec((error, cookingRecipe) => {
                if (cookingRecipe) {
                    CookingRecipe.update({ _id: cookingRecipe._id }, { $set: { multiplier } }, (err) => {
                        if (!err) {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.status(403).send();
        }
    });

    app.patch('/api/cookingRecipes/:recipeId/stopCooking', requireAuth, function (req, res) {
        const recipeId = req.params.recipeId;

        if (req.user) {
            CookingRecipe.findOne({ recipe: recipeId, user: req.user._id }).exec((error, cookingRecipe) => {
                if (cookingRecipe) {
                    CookingRecipe.update({_id: cookingRecipe._id}, {$set: { isCooking: false } }, (err) => {
                        if (!err) {
                            res.sendStatus(200);
                        }
                    });
                } else {
                    res.sendStatus(200);
                }
            });
        } else {
            res.status(403).send();
        }
    });
}

module.exports.init = init;