const async = require('async');

const errorHandler = require('../errorHandler');
const authorize = require('../middlewares/authorization');
const OCRService = require('../services/ocr.js');
const RecipeFormatterService = require('../services/recipe-formatter');

class InstructionController {

  constructor(app) {
    // Configure routes
    app.post('/api/ocr/instructions', authorize, OCRService.getStorage().single('uploadedFile'), this.parseInstructions);
  }

  parseInstructions(req, res) {
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
        let instructions = result.content.replace(/([\w\u00E0-\u00FC]+\s)\r\n/gi, "$1").split("\n");
        instructions = RecipeFormatterService.formatInstructions(instructions);

        res.status(200).send(instructions);
      } else {
        errorHandler.client(error, res);
      }
    });
  }
}

module.exports = function(expressApp) {
  return new InstructionController(expressApp);
};
