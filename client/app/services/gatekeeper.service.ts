import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class Gatekeeper implements CanActivate {
    constructor(
      private authService: AuthService,
      private router: Router,
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      const url: string = state.url;

      if (this.authService.userAuthenticated$.getValue()) {
        if (url === '/login') {
          this.router.navigate(['/recipes']);
          return false;
        }

        return true;
      }

      if (url === '/login') { return true; }

      // Store the attempted URL for redirecting
      this.authService.redirectUrl = url;

      // Navigate to the login page with extras
      this.router.navigate(['/login']);
      return false;
    }
}
