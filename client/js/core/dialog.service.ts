import { Injectable } from '@angular/core';

const swal = require('bootstrap-sweetalert');

@Injectable()
export class DialogService {

    constructor() {}

    confirm(title: string, text: string = null): Promise<{}> {
        return new Promise((resolve, reject) => {
            swal({
                title,
                text,
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Annuler',
                confirmButtonText: 'OK',
                confirmButtonClass: 'btn-warning',
            }, (choice: boolean) => {
                if (choice) {
                    resolve();
                }

                reject();
            });
        });
    }

    show(title: string, text: string) {
        swal({
            customClass: 'announcement',
            title: title || '',
            text,
            showConfirmButton: false
        });
    }

    close() {
        swal.close();
    }
}