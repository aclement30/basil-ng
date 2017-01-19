const config = require('../../config/server.js'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check;
const async = require('async');

const OCRService = require('../services/ocr.js');

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

                let instructions = result.content.replace(/(\w+\s)\r\n/gi, "$1").split("\n");

                instructions.map((instruction) => {
                    instruction = instruction.trim();

                    // Remove step number
                    //instruction = instruction.replace(/^([0-9])+\.\s/g, '');

                    return instruction;
                });

                res.status(200).send(instructions);
            } else {
                errorHandler.client(error, res);
            }
        });
    });
}

module.exports.init = init;