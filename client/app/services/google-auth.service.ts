import { Injectable, NgZone } from '@angular/core';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';

import { GOOGLE_CLIENT_ID } from '../app.config';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { SessionActions } from '../store/session.actions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare const gapi: any;

@Injectable()
export class GoogleAuthService extends AuthService {

  private googleIdToken$ = new BehaviorSubject<string>(null);
  private apiLoaded$ = new AsyncSubject<boolean>();

  constructor(
    protected http: HttpClient,
    protected sessionActions: SessionActions,
    protected zone: NgZone,
  ) {
    super(http, sessionActions);
  }

  waitForGoogleApi = () => {
    if (typeof gapi !== 'undefined') {
      gapi.load('auth2', this._onApiLoad);
    } else {
      setTimeout(this.waitForGoogleApi, 50);
    }
  }

  authenticateUser(): Observable<any> {
    return this.googleIdToken$.filter(Boolean)
      .flatMap((idToken: string) => {
        return this.requestAccessToken(idToken);
      });
  }

  requestAccessToken(idToken: string): Observable<string> {
    return this.http.post<any>('/api/access_token', { provider: 'google', idToken })
      .map((data: { accessToken: string }) => {
        localStorage.setItem('basil-token', data.accessToken);
        this.accessToken = data.accessToken;
        this.userAuthenticated$.next(true);
        return data.accessToken;
      })
      .catch(() => {
        this.clearLocalUser();
        return Observable.throw('Error while authenticating with backend server');
      });
  }

  logoutUser(): Observable<any> {
    return this.apiLoaded$
      .flatMap(() => {
        return Observable.fromPromise(gapi.auth2.getAuthInstance().signOut());
      })
      .flatMap(() => {
        return super.logoutUser();
      })
      .do(() => {
        this.googleIdToken$.next(null);
        this.userAuthenticated$.next(false);
      });
  }

  bindSignInButton(button: Element): void {
    this.apiLoaded$.take(1).subscribe(() => {
      gapi.auth2.getAuthInstance().attachClickHandler(button);
    });
  }

  private _onApiLoad = () => {
    const auth2 = gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email',
      cookiepolicy: 'single_host_origin',
    });

    // Listen for changes to current user
    auth2.currentUser.listen(this._onUserChanged);
  }

  private _onUserChanged = (googleUser) => {
    this.apiLoaded$.next(true);
    this.apiLoaded$.complete();

    this.zone.run(() => {
      if (googleUser.isSignedIn()) {
        const idToken = googleUser.getAuthResponse().id_token;
        this.googleIdToken$.next(idToken);
      }
    });
  }
}
