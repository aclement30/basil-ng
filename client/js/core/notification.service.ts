import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import 'bootstrap-notify';

@Injectable()
export class NotificationService {

    constructor() {}

    notify(message: string, type?: string) {
        if (!type) {
            type = 'inverse';
        }

        $.notify({
            message: message
        }, {
            type,
            placement: {
                from: 'bottom',
                align: 'left',
            },
            animate: {
                enter: 'fadeInUp',
            },
        });
    }
}