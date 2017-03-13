const TagService = require('../services/tag');

const errorHandler = require('../errorHandler');
const requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/tags', requireAuth, (req, res) => {
        TagService.getTags((error, tags) => {
            res.header('X-Total-Count', tags.length);
            res.send(tags);
        });
    });
}

module.exports.init = init;