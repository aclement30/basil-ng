import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'bootstrap-notify';

@Injectable()
export class NotificationService {

    constructor() {}

    notify(message: string, type?: string, options?: any) {
        if (!type) {
            type = 'inverse';
        }

        const notificationOptions = Object.assign({}, {
            type,
            placement: {
                from: 'bottom',
                align: 'left',
            },
            animate: {
                enter: 'fadeInUp',
            },
        }, options);

        return $.notify({
            message: message,
            icon: options && options.icon ? options.icon : null,
        }, notificationOptions);
    }
}