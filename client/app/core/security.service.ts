import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';

import { ISession } from '../redux';
import { SessionActions } from './redux.actions';
import User from './user.model';

@Injectable()
export class SecurityService {
    @select('session') session$: Observable<ISession>;
    public isAuthenticated = false;
    private isLoading = false;
    public user$: Observable<User>;

    constructor(private http: HttpClient, private router: Router, private sessionActions: SessionActions) {
        this.session$.subscribe(this.onSessionChange);
    }

    authenticate(): Observable<User> {
        this.sessionActions.startLoading();

        this.session$.first().subscribe((session: ISession) => {
            this.user$ = this.http.get<User>('/api/user')
                .do((user: User) => {
                    this.sessionActions.setUser(user);
                    this.sessionActions.stopLoading();
                })
                // Not logged in
                .catch((error: any) => {
                    // If stored user has a refresh token, attempt to get a new access token
                    if (session.user && session.user.refreshToken) {
                        return this.refreshToken(session.user);
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

    onSessionChange = (session: ISession) => {
        const isAuthenticated = !!session.user;
        const routeName = this.router.routerState.snapshot.url;

        if (!!session.user !== this.isAuthenticated || session.loading !== this.isLoading) {
            this.isAuthenticated = !!session.user && !!session.user.id;

            if (isAuthenticated && routeName === 'login') {
                this.router.navigate(['']);
            } else if (!isAuthenticated && routeName !== 'login') {
                this.router.navigate(['login']);
            }
        }
    }
}
