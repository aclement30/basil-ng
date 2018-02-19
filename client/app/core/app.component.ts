import { Component, OnInit } from '@angular/core';

import { CookingRecipeService } from '../services/cooking-recipe.service';
import { SessionActions } from '../store/session.actions';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

@Component({
    selector: 'body',
    template: `
        <router-outlet></router-outlet>
        <audio src="/assets/sounds/chime.wav" class="chime-sound"></audio>
        <audio src="/assets/sounds/ding.mp3" class="ding-sound"></audio>
    `,
    providers: [ SessionActions ]
})

export class AppComponent implements OnInit {
    constructor(
      private authService: AuthService,
      private cookingRecipeService: CookingRecipeService,
      private router: Router,
    ) {}

    ngOnInit() {
      (this.authService as GoogleAuthService).waitForGoogleApi();

      this.authService.initUser().subscribe((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          // Retrieve user base data from server
          this.authService.fetchUser()
            .subscribe((data: any) => {
              if (this.router.url === '/login') {
                this.router.navigate(['/recipes']);
              }
            });
        } else {
          if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
          }
        }
      });
    }

    onAuthResolve = () => {
        this.cookingRecipeService.query().subscribe();
    }
}
