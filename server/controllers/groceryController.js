const async = require('async');

const GroceryItem = require('../models/groceryItem');
const GroceryService = require('../services/grocery');
const errorHandler = require('../errorHandler');
const authorize = require('../middlewares/authorization');

class GroceryController {

  constructor(app) {
    // Configure routes
    app.get('/api/groceries', authorize, this.getGroceries);
    app.get('/api/groceries/search', authorize, this.searchItems);
    app.post('/api/groceries', authorize, this.addItems);
    app.put('/api/groceries/:itemId', authorize, this.updateItem);
    app.patch('/api/groceries/:itemId/toggle', authorize, this.toggleItem);
    app.delete('/api/groceries/clear', authorize, this.clearItems);
    app.delete('/api/groceries/:itemId', authorize, this.removeItem);
  }

  getGroceries(req, res) {
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

    GroceryService.getItems(req.user, { offset, limit }, (error, items) => {
      res.header('X-Total-Count', items.count);
      res.send(items);
    });
  }

  searchItems(req, res) {
    GroceryService.searchItems(req.user, req.query.keywords, (error, items) => {
      let results = items.map(item => ({ name: item }));

      res.send(results);
    });
  }

  addItems(req, res) {
    const items = req.body;

    if (!items || items.length === 0) {
      errorHandler.client("Request body must contains an array of item(s)", res);
      return;
    }

    async.waterfall([
      (callback) => {
        GroceryService.getItems(req.user, null, callback);
      },
      (existingItems, callback) => {
        async.map(items, (data, mapCallback) => {
          if (!data) {
            errorHandler.client("Invalid item", res);
            return;
          }

          const itemData = {
            quantity: data['quantity'] ? parseInt(data['quantity']) : null,
            name: data['name'] ? data['name'] : data['description'],
            unit: data['unit'],
            position: data['position'] ? parseInt(data['position']) : null,
            recipe: data['recipe'],
            user: req.user._id
          };

          if (data['name']) {
            // Check if an existing item in shopping list match with new item name
            const matchingItem = GroceryService.findMatchingItem(itemData, existingItems);

            if (matchingItem) {
              // Merge the existing item with the new item
              const mergedItem = GroceryService.mergeItems(matchingItem, itemData);

              if (mergedItem) {
                mergedItem.save((err) => {
                  mapCallback(err, mergedItem);
                });

                return;
              }
            }
          }

          // Create a new model instance with our object
          const groceryItem = new GroceryItem(itemData);

          groceryItem.save((err) => {
            mapCallback(err, groceryItem);
          });
        }, callback);
      }
    ], (error, groceryItems) => {
      if (!error) {
        res.status(201).send(groceryItems);
      } else {
        errorHandler.client(error, res);
      }
    });
  }

  updateItem(req, res) {
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
  }

  toggleItem(req, res) {
    const itemId = req.params.itemId;

    if (req.user) {
      GroceryItem.findOne({ _id: itemId, user: req.user._id }, (err, item) => {
        if (item) {
          GroceryItem.update({ _id: item._id }, { $set: { isCrossed: !item.isCrossed } }, (err) => {
            item.isCrossed = !item.isCrossed;
            if (!err) {
              res.send(item);
            }
          });
        } else {
          res.sendStatus(204);
        }
      });
    } else {
      res.status(403).send();
    }
  }

  clearItems(req, res) {
    GroceryItem.update({
      isDeleted: false,
      isCrossed: true,
      user: req.user._id
    }, { $set: { isDeleted: true } }, { multi: true }, (err) => {
      if (!err) {
        res.sendStatus(204);
      }
    });
  }

  removeItem(req, res) {
    const itemId = req.params.itemId;

    GroceryItem.update({ _id: itemId, user: req.user._id }, { $set: { isDeleted: true } }, (err) => {
      if (!err) {
        res.sendStatus(204);
      }
    });
  }
}

module.exports = function(expressApp) {
  return new GroceryController(expressApp);
};
