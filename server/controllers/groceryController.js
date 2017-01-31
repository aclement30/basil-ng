const GroceryItem = require('../models/groceryItem');
const errorHandler = require('../errorHandler');
const requireAuth = require('../services/auth').check;

function init(app) {
    app.get('/api/groceries', requireAuth, (req, res) => {
        let limit = Number(req.query.limit) || 100;
        if (limit < 1 || limit > 500) {
            limit = 100;
        }
        let page = Number(req.query.page) || 1;
        if (page < 1) {
            page = 1;
        }
        const offset = (page - 1) * limit;

        res.header('X-Page', page);

        GroceryItem.count({ sDeleted: false, user: req.user._id }).exec((countError, count) => {
            res.header('X-Total-Count', count);

            GroceryItem.find({ isDeleted: false, user: req.user._id }).skip(offset).limit(limit).sort({ date: -1 }).exec((err, items) => {
                res.send(items);
            });
        });
    });

    app.post('/api/groceries', requireAuth, (req, res) => {
        const data = req.body;

        // Construct a new GroceryItem object
        const itemData = {
            quantity: data['quantity'] ? parseInt(data['quantity']) : 1,
            name: data['name'],
            unit: data['unit'],
            position: data['position'] ? parseInt(data['position']) : null,
            recipe: data['recipe'],
            user: req.user._id
        };

        // Create a new model instance with our object
        const groceryItem = new GroceryItem(itemData);

        groceryItem.save((error) => {
            if (!error) {
                res.status(201).send(groceryItem);
            } else {
                errorHandler.client(error, res);
            }
        });
    });

    app.put('/api/groceries/:recipeId', requireAuth, (req, res) => {
        const itemId = req.params.itemId;
        const data = req.body;

        if (!itemId || itemId == 'undefined') {
            errorHandler.client("Missing item ID", res);

            return;
        }

        GroceryItem.findOne({ _id: itemId, user: req.user._id }, (err, item) => {
            if (err) {
                errorHandler.client("Grocery item not found (#" + itemId + ')', res);

                return;
            }

            item.quantity = data['quantity'] ? parseInt(data['quantity']) : 1;
            item.name = data['name'];
            item.unit = data['unit'];
            item.position = data['position'] ? parseInt(data['position']) : null;
            item.recipe = data['recipe'];

            item.save((error) => {
                if (!error) {
                    res.send(item);
                } else {
                    errorHandler.client(error, res);
                }
            });
        });
    });

    app.delete('/api/groceries/:itemId', requireAuth, (req, res) => {
        const itemId = req.params.itemId;

        GroceryItem.update({ _id: itemId, user: req.user._id }, { $set: { isDeleted: true } }, (err) => {
            if (!err) {
                res.sendStatus(200);
            }
        });
    });
}

module.exports.init = init;