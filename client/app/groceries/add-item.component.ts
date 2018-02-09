import { Component, EventEmitter, Output } from '@angular/core';

import { GroceryService } from '../services/grocery.service';
import { GroceryItem } from '../models/grocery-item.model';

@Component({
    selector: 'add-item',
    template: `
        <input type="search" [(ngModel)]="newItemText" placeholder="Ajouter un ingrédient" class="form-control" (keyup)="onKeyUp($event)">
        <button type="button" class="btn btn-default" (click)="exitEditMode()">OK</button>
    `,
    styleUrls: ['add-item.component.scss'],
})

export class AddItemComponent {
    @Output() toggleEditMode = new EventEmitter<any>();
    @Output() itemAdded = new EventEmitter<GroceryItem>();

    public newItemText: string;

    constructor(private groceryService: GroceryService) {}

    onKeyUp = ($event: KeyboardEvent) => {
        if ($event.which === 13) {
            this.createItem();
            $event.preventDefault();
        }
    }

    createItem() {
        const item = this.groceryService.parse(this.newItemText);

        this.groceryService.add([item])
            .subscribe((items) => {
                this.itemAdded.emit(items[0]);
            });

        this.newItemText = null;
    }

    exitEditMode() {
        if (this.newItemText && this.newItemText !== '') {
            this.createItem();
        }

        this.toggleEditMode.emit();
    }
}
