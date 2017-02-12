const convert = require('convert-units');

import { FoodItem } from '../core/interfaces';

export const UNIT_TYPES = {
    volume: convert().possibilities('volume'),
    mass: convert().possibilities('mass'),
    item: ['box', 'tablet', 'pinch'],
};

export class GroceryItem implements FoodItem {
    _id?: string;
    quantity?: number;
    name: string;
    unit?: string;
    position?: number;
    isCrossed: boolean = false;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }

    get unitType() {
        if (!this.unit) {
            return 'item';
        }

        if (UNIT_TYPES.volume.indexOf(this.unit)) {
            return 'volume';
        } else if (UNIT_TYPES.mass.indexOf(this.unit)) {
            return 'mass';
        } else {
            return 'item';
        }
    }
}
