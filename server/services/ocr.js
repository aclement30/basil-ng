const config = require('../../config/server.js');
const fs = require('fs');
const md5 = require('md5');
const multer = require('multer');
const sharp = require('sharp');
const async = require('async');
const request = require('request');

module.exports = {
    getStorage() {
        const storage = multer.diskStorage({
            destination: 'tmp/uploads',
            filename: (req, file, cb) => {
                cb(null, md5(file.originalname + Date.now()) + '.' + file.originalname.split('.').pop());
            }
        });

        return multer({ storage });
    },

    processImage(path, processingCallback) {
        let orientation;
        const originalFile = path;
        const outputFile = 'tmp/uploads/' + md5(path + Date.now()) + '-processed.' + path.split('.').pop();
        const tempFile = 'tmp/uploads/' + md5(path + Date.now()) + '-temp.' + path.split('.').pop();

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
                // Compress and resize image to fit within provided dimensions
                sharp(originalFile)
                    .resize(2600, 2600)
                    .max()
                    .withoutEnlargement()
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
            // Remove temporary file
            fs.unlink(originalFile);

            processingCallback(processingError, outputFile);
        });
    },

    scanImage(file, scanCallback) {
        const options = {
            url: config.ocrApi.url,
            method: 'POST',
            headers: {
                'apikey': config.ocrApi.apiKey,
            },
            formData: {
                language: 'fre',
                isOverlayRequired: 'false',
                file: fs.createReadStream(file),
            }
        };

        request(options, (error, httpResponse, body) => {
            // Remove temporary file
            fs.unlink(file);

            const responseBody = JSON.parse(body);
            let content = null;

            if (responseBody.ParsedResults && responseBody.ParsedResults.length) {
                content = responseBody.ParsedResults[0].ParsedText;
            }

            scanCallback(error, {
                statusCode: httpResponse.statusCode,
                content,
            });
        });
    }
};
