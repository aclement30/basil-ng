import { Component, OnInit } from '@angular/core';

import { CookingRecipeService } from '../recipes/cooking-recipe.service';
import { SecurityService } from './security.service';
import { SessionActions } from './redux.actions';

@Component({
    selector: 'body',
    template: `
        <router-outlet></router-outlet>
        <audio src="/sounds/chime.wav" class="chime-sound"></audio>
        <audio src="/sounds/ding.mp3" class="ding-sound"></audio>
    `,
    providers: [ SessionActions, SecurityService ]
})

export class AppComponent implements OnInit {
    constructor(
        private cookingRecipeService: CookingRecipeService,
        private securityService: SecurityService) {}

    ngOnInit(): void {
        this.securityService.authenticate().subscribe(this.onAuthResolve, this.onAuthFailed);
    }

    onAuthResolve = () => {
        this.cookingRecipeService.query();
    }

    onAuthFailed = () => {}
}
