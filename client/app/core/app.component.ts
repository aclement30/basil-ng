import { Component, OnInit } from '@angular/core';

import { CookingRecipeService } from '../services/cooking-recipe.service';
import { SecurityService } from '../services/security.service';
import { SessionActions } from '../store/session.actions';

@Component({
    selector: 'body',
    template: `
        <router-outlet></router-outlet>
        <audio src="/assets/sounds/chime.wav" class="chime-sound"></audio>
        <audio src="/assets/sounds/ding.mp3" class="ding-sound"></audio>
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
        this.cookingRecipeService.query().subscribe();
    }

    onAuthFailed = () => {}
}
