const config = require('../../config/server.js'),
    errorHandler = require('../errorHandler'),
    requireAuth = require('../services/auth').check,
    request = require('request'),
    multer = require('multer'),
    fs = require('fs'),
    md5 = require('md5'),
    sharp = require('sharp'),
    async = require('async');

const storage = multer.diskStorage({
    destination: 'tmp/uploads',
    filename: (req, file, cb) => {
        cb(null, md5(file.originalname + Date.now()) + '.' + file.originalname.split('.').pop());
    }
});
const upload = multer({ storage });

function init(app) {
    app.post('/api/ocr/ingredients', requireAuth, upload.single('uploadedFile'), (req, res) => {
        let orientation;

        const originalFile = req.file.path;
        const outputFile = 'tmp/uploads/' + md5(req.file.originalname + Date.now()) + '-processed.' + req.file.path.split('.').pop();
        const tempFile = 'tmp/uploads/' + md5(req.file.originalname + Date.now()) + '-temp.' + req.file.path.split('.').pop();

        async.series([
            (callback) => {
                // Retrieve image orientation from EXIF metadata
                sharp(originalFile)
                    .metadata()
                    .then((metadata) => {
                        orientation = metadata.orientation;
                        callback();
                    });
            },
            (callback) => {
                // Compress image
                sharp(originalFile)
                    .jpeg(80)
                    .toFile(outputFile, (error) => {
                        callback(error);
                    });
            },
            (callback) => {
                // Skip if orientation is correct
                if (orientation === 1) {
                    callback(false);
                    return;
                }

                // Create a temporary copy
                const data = fs.readFileSync(outputFile);
                fs.writeFileSync(tempFile, data);

                // Calculate rotation needed from current orientation
                let degrees;
                if (orientation === 8) {
                    degrees = -90;
                } else if (orientation === 3) {
                    degrees = 180;
                } else if (orientation === 6) {
                    degrees = 90;
                }

                // Rotate image so the text is horizontal
                sharp(tempFile)
                    .rotate(degrees)
                    .toFile(outputFile, (error) => {
                        fs.unlink(tempFile);

                        callback(error);
                    });
            }
        ], (processingError, results) => {
            if (processingError) {
                errorHandler.client('Erreur lors de l\'analyse de l\'image', res);
                return;
            }

            const options = {
                url: config.ocrApi.url,
                method: 'POST',
                headers: {
                    'apikey': config.ocrApi.apiKey,
                },
                formData: {
                    language: 'fre',
                    isOverlayRequired: 'false',
                    file: fs.createReadStream(outputFile),
                }
            };

            request(options, (error, httpResponse, body) => {
                fs.unlink(req.file.path);

                if (httpResponse && (httpResponse.statusCode === 200 || httpResponse.statusCode === 201)) {
                    const responseBody = JSON.parse(body);

                    // If nothing found
                    if (!responseBody.ParsedResults) {
                        errorHandler.client('Aucun résultat', res);
                        return;
                    }

                    const parsedText = responseBody.ParsedResults[0].ParsedText;

                    let rawIngredients = parsedText.split("\n");

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

                    res.status(200).send(ingredients);
                } else {
                    errorHandler.client(error, res);
                }
            });
        });
    });
}

module.exports.init = init;