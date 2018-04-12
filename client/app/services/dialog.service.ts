import { Injectable } from '@angular/core';
import * as swal from 'bootstrap-sweetalert';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DialogService {

    constructor(
      private translate: TranslateService,
    ) {}

    confirm(title: string, text: string = null): Promise<{}> {
        return new Promise((resolve, reject) => {
            swal({
                title,
                text,
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: this.translate.instant('common.actions.cancel'),
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
