const Tag = require('../models/tag');

class TagService {

    getTags(lang, callback) {
        Tag.find({ isDeleted: false }).sort(`name_${lang}`).exec((error, tags) => {
            const translatedTags = tags.map((tag) => ({
              _id: tag._id,
              name: tag[`name_${lang}`],
              alias: tag.alias,
            }));
            callback(error, translatedTags);
        });
    }
}

module.exports = new TagService();
