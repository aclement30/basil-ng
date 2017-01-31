export class GroceryItem {
    _id: string;
    quantity?: number;
    name: string;
    unit?: string;
    position?: number;
    recipe: string;

    constructor(data: any = {}) {
        Object.assign(this, data);
    }
}
