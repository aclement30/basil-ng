import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../recipes/recipe.service';
import { SecurityService } from './security.service';
import { SessionActions } from './redux.actions';

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet><audio src="chime.wav" class="chime-sound"></audio><audio src="ding.mp3" class="ding-sound"></audio>',
    providers: [ SessionActions, SecurityService ]
})

export class AppComponent implements OnInit {
    constructor(
        private recipeService: RecipeService,
        private securityService: SecurityService) {}

    ngOnInit(): void {
        this.securityService.authenticate().subscribe(this.onAuthResolve, this.onAuthFailed);
    }

    onAuthResolve = () => {
        this.recipeService.queryCookingRecipes();
    }

    onAuthFailed = () => {}
}
