import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user.model';
import { SessionActions } from '../store/session.actions';

@Injectable()
export abstract class AuthService {
  redirectUrl: string;

  userAuthenticated$ = new BehaviorSubject<boolean>(null);
  protected tokenRequest$: Observable<string>;
  protected accessToken: string;

  constructor(
    protected http: HttpClient,
    protected sessionActions: SessionActions,
  ) {}

  initUser(): Observable<boolean> {
    const accessToken = localStorage.getItem('basil-token');
    if (accessToken) {
      this.accessToken = accessToken;
      this.userAuthenticated$.next(true);
      return Observable.of(true);
    }

    return Observable.of(false);
  }

  authenticateUser(): Observable<any> {
    return Observable.throw('Error: not implemented');
  }

  logoutUser(): Observable<any>  {
    return Observable.of(this.clearLocalUser());
  }

  // DOES NOT WORK
  // refreshAccessToken(): Observable<string> {
  //   // Skip is token refresh process is already ongoing
  //   if (this.tokenRefreshRequest$) {
  //     return this.tokenRefreshRequest$;
  //   }
  //
  //   const googleToken = this.googleAuthService.userAuthenticated$.getValue();
  //   if (googleToken === null) {
  //     return this.tokenRefreshRequest$ = this.googleAuthService.userAuthenticated$
  //       .filter((token) => (token !== null))
  //       .flatMap((token: string | boolean): Observable<string> => {
  //         return this._exchangeGoogleAuthToken(token);
  //       });
  //   }
  //
  //   return this._exchangeGoogleAuthToken(googleToken);
  // }

  fetchUser(): Observable<User> {
    return this.http.get<User>('/api/user')
      .do((user: User) => {
        this.sessionActions.setUser(user);
      });
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Clearing Localstorage of browser
   */
  protected clearLocalUser(): void {
    this.sessionActions.resetUser();
    this.accessToken = null;
    localStorage.removeItem('basil-token');
  }
}
