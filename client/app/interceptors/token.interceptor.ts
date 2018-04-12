import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as urlParser from 'url-parse';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('basil-token');

    const requestHostname = urlParser(request.url).hostname;
    const serverHostname = urlParser(window.document.location).hostname;
    if (requestHostname === serverHostname) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).do((event: HttpEvent<any>) => {}, (error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const authService = this.injector.get(AuthService);

        authService.logoutUser().subscribe(() => {
          this.notificationService.notify(
            this.translate.instant('common.sessionExpired'),
            'warning',
            { icon: 'zmdi zmdi-alert-triangle' },
          );

          const router = this.injector.get(Router);
          if (router.url !== '/login') {
            router.navigate(['/login']);
          }
        });

        // REQUEST RETRY DOES NOT WORK
        // return authService.refreshAccessToken()
        //   .switchMap(() => {
        //     // Retry failed request if token refresh is successful
        //     return next.handle(request);
        //   })
        //   .catch(() => {
        //     return Observable.empty();
        //   });

        return Observable.empty();
      }

      return Observable.throw(error);
    });
  }
}
