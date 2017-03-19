import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { select } from "ng2-redux";

import { IUI } from "../redux";
import { NotificationService } from "./notification.service";

const PING_INTERVAL = 30000;

@Injectable()
export class Watchman {
    @select('ui') ui$: Observable<IUI>;

    private pingTimeout: any;
    private retryInterval = 2000;
    private notificationHandle: any;

    constructor(
        private http: Http,
        private notificationService: NotificationService) {
        document.addEventListener('visibilitychange', this.onVisibilityChange, false);

        this.ping();
    }

    onVisibilityChange = () => {
        if (document.hidden) {
            if (this.pingTimeout) {
                window.clearTimeout(this.pingTimeout);
            }
        } else {
            this.ping();
        }
    }

    ping = () => {
        return this.http.get('/api/ping')
            .timeout(2000)
            .map((response: Response) => {
                this.ui$.first().subscribe((ui: IUI) => {
                    this.retryInterval = 2000;

                    if (this.notificationHandle) {
                        this.notificationHandle.close();
                        this.notificationHandle = null;
                    }
                });

                if (!document.hidden) {
                    this.pingTimeout = setTimeout(this.ping, PING_INTERVAL);
                }
            })
            // Backend does not respond
            .catch(this.onPingFailed).toPromise();
    }

    onPingFailed = (error: Response | any) => {
        if (!this.notificationHandle) {
            this.notificationHandle = this.notificationService.notify('Reconnexion au serveur en cours...', 'danger', { icon: 'zmdi zmdi-input-antenna', delay: 0, allow_dismiss: false });
        }

        // Stop trying to ping server after 4 minutes
        if (this.retryInterval > 256000) {
            return;
        }

        this.pingTimeout = setTimeout(this.ping, this.retryInterval);
        this.retryInterval = this.retryInterval * 2;

        return Observable.of(false);
    }
}