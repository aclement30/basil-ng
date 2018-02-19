const async = require('async');

const errorHandler = require('../errorHandler');
const authorize = require('../middlewares/authorization');
const OCRService = require('../services/ocr.js');
const RecipeFormatterService = require('../services/recipe-formatter');

class IngredientController {

  constructor(app) {
    // Configure routes
    app.post('/api/ocr/ingredients', authorize, OCRService.getStorage().single('uploadedFile'), this.parseIngredients);
  }

  parseIngredients(req, res) {
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

        let rawIngredients = result.content.split("\n");

        let hasUnitReversed = 0;
        let ingredients = [];
        rawIngredients.forEach((ingredient) => {
          // Check if ingredient description & unit are reversed
          if (ingredient.match(/(.+)\(.+\)/)) {
            hasUnitReversed++;
          }

          const trimmedIngredient = ingredient.trim();

          if (trimmedIngredient.length) {
            ingredients.push(trimmedIngredient);
          }
        });

        // If most of ingredients are reversed, inverse description & unit
        if (hasUnitReversed >= ingredients.length - 1) {
          ingredients = ingredients.map((ingredient) => {
            const matches = ingredient.match(/(.+)\((.+)\)/);
            const description = matches[1];
            let unit = matches[2];

            let particle = 'de ';

            let words = description.split(' ');
            words[0] = words[0].toLowerCase();
            if (words[0].match(/^[aàâeéèêëiïîoôuù](.+)/)) {
              particle = 'd\'';
            }

            if (unit.match(/unités?/)) {
              particle = '';
              unit = unit.replace(/\sunités?/, '');
            }

            return `${unit} ${particle}${words.join(' ')}`.trim();
          });
        }

        ingredients = RecipeFormatterService.formatIngredients(ingredients);

        res.status(200).send(ingredients);
      } else {
        errorHandler.client(error, res);
      }
    });
  }
}

module.exports = function(expressApp) {
  return new IngredientController(expressApp);
};
