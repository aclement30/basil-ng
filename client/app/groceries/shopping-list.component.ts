import { Component, OnInit } from '@angular/core';

import { GroceryItem } from './grocery-item.model';
import { GroceryService } from './grocery.service';

@Component({
    selector: 'shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['shopping-list.component.scss'],
})

export class ShoppingListComponent implements OnInit {

    items: GroceryItem[] = [];
    editModeEnabled = false;

    constructor(private groceryService: GroceryService) {}

    ngOnInit(): void {
        this.getItems();
    }

    getItems = (): void => {
        this.groceryService.query()
            .subscribe(items => {
                this.items = items;
            });
    }

    toggleEditMode() {
        this.editModeEnabled = !this.editModeEnabled;
    }

    itemAdded(newItem: GroceryItem) {
        this.getItems();
    }

    toggleItem(item: GroceryItem) {
        this.groceryService.toggleItem(item).subscribe();
    }

    clearCrossedItems() {
        this.groceryService.clearCrossedItems()
            .subscribe(this.getItems);
    }

    remove(item: GroceryItem) {
        this.groceryService.remove(item._id)
            .subscribe(() => {
                const INDEX = this.items.findIndex(listItem => (listItem._id === item._id));
                this.items.splice(INDEX, 1);
            });
    }
}
