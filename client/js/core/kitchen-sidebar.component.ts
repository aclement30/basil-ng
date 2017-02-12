import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { ICookingRecipes, IUI } from '../redux';
import { RecipeSummary } from '../recipes/recipe.model';
import { UIActions } from './redux.actions';

@Component({
    selector: 'kitchen-sidebar',
    template: `
        <aside class="sidebar" [ngClass]="{'toggled': sidebarDisplayed$ | async}">
            <ul class="sua-menu list-inline list-unstyled">
                <!--<li><a href=""><i class="zmdi zmdi-check-all"></i> Arrêter tous</a></li>-->
                <li><button (click)="closeSidebar()" data-ma-action="sidebar-close"><i class="zmdi zmdi-close"></i> Fermer</button></li>
            </ul>

            <div class="list-group lg-alt c-overflow">
                <a *ngFor="let recipe of recipes$ | async" (click)="showRecipe(recipe._id)" class="list-group-item media">
                    <div class="pull-left">
                        <img class="avatar-img" [src]="recipe.image">
                    </div>

                    <div class="media-body">
                        <div class="lgi-heading">{{ recipe.title }}</div>
                        <small class="lgi-text">Commencé il y a 30 minutes</small>
                    </div>
                </a>
            </div>
        </aside>
    `
})

export class KitchenSidebarComponent {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private router: Router,
        private uiActions: UIActions) {}

    closeSidebar() {
        this.uiActions.hideKitchenSidebar();
    }

    showRecipe(recipeId: string) {
        this.router.navigate(['/recipes/detail', recipeId]);

        this.closeSidebar();
    }

    get sidebarDisplayed$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.kitchenSidebar.displayed;
        });
    }

    get recipes$(): Observable<RecipeSummary[]> {
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.list;
        });
    }
}