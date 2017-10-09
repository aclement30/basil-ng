import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../../redux';
import { UIActions } from '../redux.actions';

@Component({
    selector: '[kitchen-sidebar-button]',
    template: `
        <i class="zmdi zmdi-view-list-alt"></i>
    `
})

export class KitchenSidebarButtonComponent {
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private uiActions: UIActions) {}

    @HostListener('click') toggleKitchenSidebar() {
        this.kitchenSidebarDisplayed$.first().subscribe(isDisplayed => {
            if (isDisplayed) {
                this.uiActions.hideKitchenSidebar();
            } else {
                this.uiActions.showKitchenSidebar();
            }
        });
    }

    get kitchenSidebarDisplayed$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.kitchenSidebar.displayed;
        });
    }
}
