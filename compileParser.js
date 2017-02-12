const fs = require('fs');
const pegjs = require('pegjs');

const CONFIG = require('./config/server');

// Compile ingredients PEGJS parser
fs.readFile(CONFIG.ingredientParser.source, 'utf8', (error, data) => {
    if (error) {
        process.stderr.write(`\x1b[31mParser error: ${error.message}\x1b[0m`);
        process.exit(1);
    }

    // Compile parser
    const parser = pegjs.generate(data, { output: 'source', format: 'commonjs' });

    fs.writeFile(__dirname + '/server/ingredient.parser.js', parser, (error) => {
        if (error) {
            process.stderr.write(`\x1b[31mParser error: ${error.message}\x1b[0m`);
            process.exit(1);
        } else {
            process.exit(0);
        }
    });
});