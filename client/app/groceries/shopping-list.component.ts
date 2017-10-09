import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroceryItem } from './grocery-item.model';
import { GroceryService } from './grocery.service';
import { NotificationService } from '../core/notification.service';

@Component({
    selector: 'shopping-list',
    template: `
        <div class="c-header" [ngClass]="{editing: editModeEnabled}">
            <h2>Liste de courses</h2>
            <ul class="actions" *ngIf="!editModeEnabled">
                <li>
                    <a (click)="toggleEditMode()" class="btn btn-icon-text btn-link"><i class="zmdi zmdi-plus"></i> Ajouter</a>
                </li>
            </ul>
            <add-item *ngIf="editModeEnabled" (toggleEditMode)="toggleEditMode()" (itemAdded)="itemAdded($event)"></add-item>
        </div>
        
        <div class="card">
            <div class="card-body table-responsive">
                <table class="table items-list">
                    <tbody>
                        <tr *ngFor="let item of items" (click)="toggleItem(item)" [ngClass]="{crossed: item.isCrossed}">
                            <td class="quantity">{{ item.quantity }}<span *ngIf="item.quantity"> {{ item.unit | ingredientUnit }}</span></td>
                            <td class="name">{{ item.name | capitalize }}</td>
                            <td class="actions"><button class="btn btn-icon btn-default" (click)="remove(item)"><i class="zmdi zmdi-close"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card blank-state" *ngIf="!items.length">
            <div class="card-body card-padding">
                <i class="blank-icon zmdi zmdi-assignment-check"></i>
                <p class="lead">Votre liste de courses est vide</p>
                
                <button [routerLink]="['add']" class="btn btn-primary btn-icon-text waves-effect"><i class="zmdi zmdi-plus"></i> Ajouter un item</button>
            </div>
        </div>
        
        <div class="text-center" *ngIf="items.length">
            <button type="button" class="btn btn-warning btn-icon-text waves-effect" (click)="clearCrossedItems()"><i class="zmdi zmdi-delete"></i> Effacer les items rayés</button>
        </div>
    `,
    styleUrls: ['shopping-list.component.scss'],
})

export class ShoppingListComponent implements OnInit {

    items: GroceryItem[] = [];

    public editModeEnabled: boolean = false;

    constructor(
        private groceryService: GroceryService,
        private notificationService: NotificationService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.getItems();
    }

    getItems = (): void => {
        this.groceryService.query()
            .then(items => {
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
        this.groceryService.toggleItem(item);
    }

    clearCrossedItems() {
        this.groceryService.clearCrossedItems()
            .then(this.getItems);
    }

    remove(item: GroceryItem) {
        this.groceryService.remove(item._id)
            .then(() => {
                const INDEX = this.items.findIndex(listItem => (listItem._id === item._id));
                this.items.splice(INDEX, 1);
            })
    }
}
