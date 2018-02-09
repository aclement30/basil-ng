import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import User from './user.model';
import { getCurrentUser, getSessionState, SessionState } from '../store/session.reducer';
import { AppState } from '../store/index';
import { SessionActions } from '../store/session.actions';

@Injectable()
export class SecurityService {
    isAuthenticated = false;
    user$: Observable<User>;
    session$: Observable<SessionState>;

    constructor(
      private http: HttpClient,
      private router: Router,
      private sessionActions: SessionActions,
      private store: Store<AppState>,
    ) {
        this.session$ = this.store.select(getSessionState);
        this.store.select(getCurrentUser).subscribe(this.onUserChange);
    }

    authenticate(): Observable<User> {
        this.sessionActions.startLoading();

        this.store.select(getCurrentUser).take(1).subscribe((currentUser: User) => {
            this.user$ = this.http.get<User>('/api/user')
                .do((user: User) => {
                    this.sessionActions.setUser(user);
                    this.sessionActions.stopLoading();
                })
                // Not logged in
                .catch((error: any) => {
                    // If stored user has a refresh token, attempt to get a new access token
                    if (currentUser && currentUser.refreshToken) {
                        return this.refreshToken(currentUser);
                    } else {
                        return this.onAuthenticationError();
                    }
                });
        });

        return this.user$;
    }

    refreshToken(user: User): Observable<User> {
        this.sessionActions.startLoading();

        this.user$ = this.http.post('/auth/token', { token: user.refreshToken })
            .map((response: any) => {
                user.accessToken = response.accessToken;
                this.sessionActions.setUser(user);
                this.sessionActions.stopLoading();
                return user;
            })
            // Not logged in
            .catch(this.onAuthenticationError);

        return this.user$;
    }

    onAuthenticationError() {
        this.sessionActions.resetUser();
        this.sessionActions.stopLoading();
        return Observable.throw('Unable to authenticate user');
    }

    logout() {
        return this.http.get('/auth/logout')
            .map(() => {
                this.sessionActions.resetUser();
            });
    }

    onUserChange = (user: User) => {
        const isAuthenticated = !!user;
        const routeName = this.router.routerState.snapshot.url;

        if (!!user !== this.isAuthenticated) {
            this.isAuthenticated = !!user && !!user.id;

            if (isAuthenticated && routeName === 'login') {
                this.router.navigate(['']);
            } else if (!isAuthenticated && routeName !== 'login') {
                this.router.navigate(['login']);
            }
        }
    }
}
