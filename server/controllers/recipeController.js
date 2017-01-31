var Recipe = require('../models/recipe'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/recipes/:recipeId', requireAuth, function (req, res) {
        var recipeId = req.params.recipeId;

        Recipe.findOne({_id: recipeId, user: req.user._id}).exec(function (err, object) {
            res.send(object);
        });
    });

    app.get('/api/recipes', requireAuth, function (req, res) {
        var limit = Number(req.query.limit) || 100;
        if (limit < 1 || limit > 500) {
            limit = 100;
        }
        var page = Number(req.query.page) || 1;
        if (page < 1) {
            page = 1;
        }
        var offset = (page - 1) * limit;

        res.header('X-Page', page);

        Recipe.count({isDeleted: false, user: req.user._id}).exec(function(countError, count){
            res.header('X-Total-Count', count);

            Recipe.find({isDeleted: false, user: req.user._id}).skip(offset).limit(limit).sort({date: -1}).exec(function (err, objects) {
                res.send(objects);
            });
        });
    });

    app.post('/api/recipes', requireAuth, function (req, res) {
        var data = req.body;

        // Construct a new Recipe object
        var recipeData = {
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
            user: req.user._id
        };

        // Create a new model instance with our object
        var recipe = new Recipe(recipeData);

        recipe.save(function (error) {
            if (!error) {
                res.status(201).send(recipe);
            } else {
                errorHandler.client(error, res);
            }
        });
    });

    app.put('/api/recipes/:recipeId', requireAuth, function (req, res) {
        var recipeId = req.params.recipeId;
        var data = req.body;

        if (!recipeId || recipeId == 'undefined') {
            errorHandler.client("Missing recipe ID", res);

            return;
        }

        Recipe.findOne({_id: recipeId, user: req.user._id}, function (err, recipe) {
            if (err) {
                errorHandler.client("Recipe not found (#" + recipeId + ')', res);

                return;
            }

            recipe.title = data['title'];
            recipe.ingredients = data['ingredients'];
            recipe.recipeInstructions = data['recipeInstructions'];
            recipe.cookTime = data['cookTime'] ? parseInt(data['cookTime']) : null;
            recipe.prepTime = data['prepTime'] ? parseInt(data['prepTime']) : null;
            recipe.totalTime = data['cookTime'] || data['prepTime'] ? parseInt(data['cookTime']) + parseInt(data['prepTime']) : null;
            recipe.recipeYield = data['recipeYield'] ? parseInt(data['recipeYield']) : null;
            recipe.recipeYield = data['recipeYield'] ? parseInt(data['recipeYield']) : null;
            recipe.image = data['image'];
            recipe.originalUrl = data['originalUrl'];
            recipe.notes = data['notes'];

            recipe.save(function (error) {
                if (!error) {
                    res.send(recipe);
                } else {
                    errorHandler.client(error, res);
                }
            });
        });
    });

    app.delete('/api/recipes/:recipeId', requireAuth, function (req, res) {
        var recipeId = req.params.recipeId;

        Recipe.update({_id: recipeId, user: req.user._id}, {$set: {isDeleted: true}}, function (err) {
            if (!err) {
                res.sendStatus(200);
            }
        });
    });
}

module.exports.init = init;