import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { SecurityService } from './security.service';
import { ISession } from '../redux';

@Injectable()
export class Gatekeeper implements CanActivate {
    constructor(
        private router: Router,
        private securityService: SecurityService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const routeName = route.url.join('');

        if (routeName === 'login' && this.securityService.isAuthenticated) {
            this.router.navigate(['/']);
            return false;
        } else if (routeName !== 'login' && !this.securityService.isAuthenticated) {
            return this.securityService.session$
                .skipWhile((session) => (session.loading))
                .map((session) => {
                    return this.securityService.isAuthenticated;
                });
        }

        return true;
    }
}