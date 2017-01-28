const config = require('../../config/server.js'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check;
const async = require('async');

const OCRService = require('../services/ocr.js');
const RecipeFormatterService = require('../services/recipe-formatter');

function init(app) {
    app.post('/api/ocr/instructions', requireAuth, OCRService.getStorage().single('uploadedFile'), (req, res) => {
        const originalFile = req.file.path;

        async.waterfall([
            OCRService.processImage.bind(null, originalFile),
            OCRService.scanImage,
        ], (processingError, result) => {
            if (processingError) {
                errorHandler.client('Erreur lors de l\'analyse de l\'image', res);
                return;
            }

            if (result.statusCode === 200 || result.statusCode === 201) {
                // If nothing found
                if (!result.content) {
                    errorHandler.client('Aucun résultat', res);
                    return;
                }

                // Remove false line breaks and split by line returns
                let instructions = result.content.replace(/(\w+\s)\r\n/gi, "$1").split("\n");
                instructions = RecipeFormatterService.formatInstructions(instructions);

                res.status(200).send(instructions);
            } else {
                errorHandler.client(error, res);
            }
        });
    });
}

module.exports.init = init;