const convert = require('convert-units');
const GroceryItem = require('../models/groceryItem');
const ingredientParser = require('../ingredient.parser.js');

const UNIT_TYPES = {
    VOLUME: {
        units: convert().possibilities('volume'),
        baseUnit: 'ml',
    },
    MASS: {
        units: convert().possibilities('mass'),
        baseUnit: 'g',
    },
    ITEM: {
        units: ['box', 'tablet', 'bit', 'packet', 'pinch'],
    },
};

class GroceryService {

    getItems(user, pagination, callback) {
        const limit = pagination && pagination.limit || 100;
        const offset = pagination && pagination.offset || 0;

        let shoppingListItems = [];

        GroceryItem.count({ isDeleted: false, user: user._id }).exec((countError, count) => {
            shoppingListItems.count = count;

            GroceryItem.find({ isDeleted: false, user: user._id }).skip(offset).limit(limit).sort({ date: -1 }).exec((error, items) => {
                shoppingListItems = shoppingListItems.concat(items);

                callback(error, shoppingListItems);
            });
        });
    }

    searchItems(user, keywords, callback) {
        let parsedIngredient;
        try {
            parsedIngredient = ingredientParser.parse(keywords.trim());
        } catch(error) {
            parsedIngredient = { name: keywords };
        }

        if (parsedIngredient.name) {
            GroceryItem.find({ user: user._id, name: { $regex: new RegExp(parsedIngredient.name.trim(), 'ig') } }).distinct('name').exec(callback);
        } else {
            callback(null, []);
        }
    }

    findMatchingItem(item, list) {
        let formattedName = item.name.toLowerCase().trim();

        const uselessWords = [
            'grosses',
            'grosse',
            'gros',
            'moyennes',
            'moyenne',
            'moyens',
            'moyen',
            'petites',
            'petits',
            'petite',
            'petit',
            'râpé',
            'fraîches',
            'fraîche',
            'frais',
            'moulue',
            'moulu',
            'en poudre',
            'morceau de',
        ];

        uselessWords.forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`);
            formattedName = formattedName.replace(regex, '').trim();
        });

        return list.find(listItem => {
            let listItemName = listItem.name;

            uselessWords.forEach((word) => {
                const regex = new RegExp(`\\b${word}\\b`);
                listItemName = listItemName.replace(regex, '').trim();
            });

            return listItemName === formattedName;
        });
    }

    mergeItems(itemA, itemB) {
        const unitTypeA = this.getUnitType(itemA);
        const unitTypeB = this.getUnitType(itemB);

        if (unitTypeA !== unitTypeB) {
            return false;
        }

        if (unitTypeA === UNIT_TYPES.ITEM) {
            itemA.quantity = (itemA.quantity + itemB.quantity);

            return itemA;
        } else {
            // Items measured in mass/volume are simply merged without any specific quantity
            return itemA;

            // const baseQuantityA = convert(itemA.quantity).from(itemA.unit).to(unitTypeA.baseUnit);
            // const baseQuantityB = convert(itemB.quantity).from(itemB.unit).to(unitTypeA.baseUnit);
            //
            // const baseQuantityTotal = baseQuantityA + baseQuantityB;
            // const convertedUnit = convert(baseQuantityTotal).from(unitTypeA.baseUnit).toBest();
            //
            // return new GroceryItem({
            //     quantity: convertedUnit,
            //     unit: unitTypeA.baseUnit,
            //     name: itemA.name,
            //     position: itemA.position,
            //     user: itemA.user,
            // });
        }
    }

    getUnitType(item) {
        if (!item.unit) {
            return UNIT_TYPES.ITEM;
        }

        if (UNIT_TYPES.VOLUME.units.indexOf(item.unit)) {
            return UNIT_TYPES.VOLUME;
        } else if (UNIT_TYPES.MASS.units.indexOf(item.unit)) {
            return UNIT_TYPES.MASS;
        } else {
            return UNIT_TYPES.ITEM;
        }
    }
}

module.exports = new GroceryService();
