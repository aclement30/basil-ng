const Tag = require('../models/tag');

class TagService {

    getTags(callback) {
        Tag.find({ isDeleted: false }).sort('name').exec((error, tags) => {
            callback(error, tags);
        });
    }
}

module.exports = new TagService();