const TagService = require('../services/tag');
const authorize = require('../middlewares/authorization');

class TagController {

  constructor(app) {
    // Configure routes
    app.get('/api/tags', authorize, this.getTags);
  }

  getTags(req, res) {
    TagService.getTags((error, tags) => {
      res.header('X-Total-Count', tags.length);
      res.send(tags);
    });
  }
}

module.exports = function(expressApp) {
  return new TagController(expressApp);
};
