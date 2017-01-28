const config = require('../../config/server.js'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check;

const ImportService = require('../services/import.js');

function init(app) {
    app.post('/api/recipes/import', requireAuth, (req, res) => {
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
    });
}

module.exports.init = init;