import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../recipes/recipe.service';
import { SecurityService } from './security.service';
import { RecipesActions, SessionActions } from './redux.actions';

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>',
    providers: [ SessionActions, SecurityService ]
})

export class AppComponent implements OnInit {
    constructor(
        private recipeService: RecipeService,
        private securityService: SecurityService,
        private recipesActions: RecipesActions) {}

    ngOnInit(): void {
        this.securityService.authenticate().subscribe(this.onAuthResolve, this.onAuthFailed);
    }

    onAuthResolve = () => {
        this.recipeService.queryCookingRecipes();
    }

    onAuthFailed = () => {}
}
