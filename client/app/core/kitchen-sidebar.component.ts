import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { RecipeSummary } from '../recipes/recipe.model';
import { AppState } from '../store/index';
import { getCookingRecipes } from '../store/cooking-recipes.reducer';
import { getKitchenSidebar, IKitchenSidebar } from '../store/ui.reducer';
import { UIActions } from '../store/ui.actions';

@Component({
    selector: 'kitchen-sidebar',
    template: `
        <aside class="sidebar" [ngClass]="{'toggled': (kitchenSidebar$ | async)?.displayed}">
            <ul class="sua-menu list-inline list-unstyled">
                <!--<li><a href=""><i class="zmdi zmdi-check-all"></i> Arrêter tous</a></li>-->
                <li><button (click)="closeSidebar()" data-ma-action="sidebar-close"><i class="zmdi zmdi-close"></i> Fermer</button></li>
            </ul>

            <div class="list-group lg-alt c-overflow">
                <a *ngFor="let recipe of cookingRecipes$ | async" (click)="showRecipe(recipe._id)" class="list-group-item media">
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
    `,
    styleUrls: ['kitchen-sidebar.component.scss'],
})

export class KitchenSidebarComponent implements OnInit {
    cookingRecipes$: Observable<RecipeSummary[]>;
    kitchenSidebar$: Observable<IKitchenSidebar>;

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private uiActions: UIActions,
    ) {}

    ngOnInit() {
      this.cookingRecipes$ = this.store.select(getCookingRecipes);
      this.kitchenSidebar$ = this.store.select(getKitchenSidebar);
    }

    closeSidebar() {
        this.uiActions.hideKitchenSidebar();
    }

    showRecipe(recipeId: string) {
        this.router.navigate(['/recipes/detail', recipeId]);

        this.closeSidebar();
    }
}
