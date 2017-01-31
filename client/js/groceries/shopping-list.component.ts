import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GroceryItem } from './grocery-item.model';
import { GroceryService } from './grocery.service';

@Component({
    selector: 'shopping-list',
    template: `
        <div class="c-header">
            <h2>Liste de courses</h2>
            <ul class="actions">
                <li>
                    <a [routerLink]="['add']" class="btn btn-icon-text btn-link"><i class="zmdi zmdi-plus"></i> Ajouter</a>
                </li>
            </ul>
        </div>

        <div class="card blank-state" *ngIf="!items.length">
            <div class="card-body card-padding">
                <i class="blank-icon zmdi zmdi-assignment-check"></i>
                <p class="lead">Votre liste de courses est vide</p>
                
                <button [routerLink]="['add']" class="btn btn-primary btn-icon-text waves-effect"><i class="zmdi zmdi-plus"></i> Ajouter un item</button>
            </div>
        </div>
    `
})

export class ShoppingListComponent implements OnInit {

    items: GroceryItem[] = [];

    constructor(
        private groceryService: GroceryService,
        private router: Router) { }

    getItems(): void {
        this.groceryService.query()
            .then(items => {
                this.items = items;
            });
    }

    ngOnInit(): void {
        this.getItems();
    }
}