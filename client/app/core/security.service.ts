import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { ISession } from '../redux';
import { SessionActions } from './redux.actions';
import User from './user.model';

@Injectable()
export class SecurityService {
    @select('session') session$: Observable<ISession>;
    public isAuthenticated: boolean = false;
    private isLoading: boolean = false;
    public user$: Observable<User>;

    constructor(private http: Http, private router: Router, private sessionActions: SessionActions) {
        this.session$.subscribe(this.onSessionChange);
    }

    authenticate(): Observable<User> {
        this.sessionActions.startLoading();

        this.session$.first().subscribe((session: ISession) => {
            this.user$ = this.http.get('/api/user')
                .map((response: Response) => {
                    const user = response.json();
                    this.sessionActions.setUser(user);
                    this.sessionActions.stopLoading();
                    return user;
                })
                // Not logged in
                .catch((error: Response | any) => {
                    // If stored user has a refresh token, attempt to get a new access token
                    if (session.user && session.user.refreshToken) {
                        return this.refreshToken(session.user);
                    } else {
                        return this.onAuthenticationError(error);
                    }
                });
        });

        return this.user$;
    }

    refreshToken(user: User): Observable<User> {
        this.sessionActions.startLoading();

        this.user$ = this.http.post('/auth/token', { token: user.refreshToken })
            .map((response: Response) => {
                user.accessToken = response.json().accessToken;
                this.sessionActions.setUser(user);
                this.sessionActions.stopLoading();
                return user;
            })
            // Not logged in
            .catch(this.onAuthenticationError);

        return this.user$;
    }

    onAuthenticationError(error: Response | any) {
        this.sessionActions.resetUser();
        this.sessionActions.stopLoading();
        return Observable.throw('Unable to authenticate user');
    }

    logout() {
        return this.http.get('/auth/logout')
            .map((response: Response) => {
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