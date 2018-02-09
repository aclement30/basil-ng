import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../store/index';
import { getCookmode } from '../../store/ui.reducer';
import { UIActions } from '../../store/ui.actions';

@Component({
    selector: '[cookmode-button]',
    template: `
        <i class="zmdi zmdi-fullscreen-alt" *ngIf="!(cookmodeEnabled$ | async)"></i>
        <i class="zmdi zmdi-fullscreen-exit" *ngIf="cookmodeEnabled$ | async"></i>
    `
})

export class CookmodeButtonComponent implements OnInit {
    cookmodeEnabled$: Observable<boolean>;

    constructor(
        private store: Store<AppState>,
        private uiActions: UIActions
    ) {}

    ngOnInit() {
      this.cookmodeEnabled$ = this.store.select(getCookmode);
    }

    @HostListener('click') toggleCookmode() {
        this.cookmodeEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableCookmode();
            } else {
                this.uiActions.enableCookmode();
            }
        });
    }
}
