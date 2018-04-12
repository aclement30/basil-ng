import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).catch((response: any) => {
      const ignoredStatusCodes: number[] = [400, 401, 402, 403];

      if (response instanceof HttpErrorResponse && !ignoredStatusCodes.includes(response.status)) {
        this.notificationService.notify(
          this.translate.instant('common.unknwonError', { status: response.status }),
          'warning',
          { icon: 'zmdi zmdi-alert-triangle' },
        );
      }

      return Observable.of(response.error);
    });
  }
}
