var Recipe = require('../models/recipe'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/recipes/:recipeId', requireAuth, function (req, res) {
        var recipeId = req.params.recipeId;

        Recipe.findById(recipeId).exec(function (err, object) {
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

        Recipe.count({isDeleted: false}).exec(function(countError, count){
            res.header('X-Total-Count', count);

            Recipe.find({isDeleted: false}).skip(offset).limit(limit).sort({date: -1}).exec(function (err, objects) {
                var objectMap = {};

                objects.forEach(function (object) {
                    objectMap[object._id] = object;
                });

                res.send(objectMap);
            });
        });
    });

    app.post('/api/recipes', requireAuth, function (req, res) {
        var data = req.body;

        // Construct a new Recipe object
        var recipeData = {
            date: data['date'],
            team1: data['team1'],
            team2: data['team2'],
            balls: parseInt(data['balls']),
            comments: data['comments']
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

        Recipe.findById(recipeId, function (err, recipe) {
            if (err) {
                errorHandler.client("Recipe not found (" + recipeId + ')', res);

                return;
            }

            //match.date = data['date'];
            //match.team1 = data['team1'];
            //match.team2 = data['team2'];
            //match.balls = parseInt(data['balls']);
            //match.comments = data['comments'];

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

        Recipe.update({_id: recipeId}, {$set: {isDeleted: true}}, function (err) {
            if (!err) {
                res.sendStatus(200);
            }
        });
    });
}

module.exports.init = init;