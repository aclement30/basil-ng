import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../../redux';
import { UIActions } from '../redux.actions';

@Component({
    selector: '[cookmode-button]',
    template: `
        <i class="zmdi zmdi-fullscreen-alt" *ngIf="!(cookmodeEnabled$ | async)"></i>
        <i class="zmdi zmdi-fullscreen-exit" *ngIf="cookmodeEnabled$ | async"></i>
    `
})

export class CookmodeButtonComponent {
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private uiActions: UIActions) {}

    @HostListener('click') toggleCookmode() {
        this.cookmodeEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableCookmode();
            } else {
                this.uiActions.enableCookmode();
            }
        });
    }

    get cookmodeEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.cookmode;
        });
    }
}
