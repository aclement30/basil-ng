import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../redux';
import { UIActions } from './redux.actions';

@Component({
    selector: 'cookmode-menu',
    template: `
        <ul class="quick-actions">
            <!--<li>
                <button (click)="startCooking()">
                    <i class="zmdi zmdi-cutlery"></i>
                </button>
            </li>-->
            <li>
                <button (click)="enableCookmode()" *ngIf="!(cookmodeEnabled$ | async)">
                    <i class="zmdi zmdi-fullscreen-alt"></i>
                </button>
                <button (click)="disableCookmode()" *ngIf="cookmodeEnabled$ | async">
                    <i class="zmdi zmdi-fullscreen-exit"></i>
                </button>
            </li>
            <!--<li data-user-alert="sua-notifications" data-ma-action="sidebar-open" data-ma-target="user-alerts">
                <i class="zmdi zmdi-notifications"></i>
            </li>-->
            <li>
                <button (click)="toggleKitchenSidebar()">
                    <i class="zmdi zmdi-view-list-alt"></i>
                </button>
            </li>
        </ul>
    `
})

export class CookmodeMenuComponent {
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private route: ActivatedRoute,
        private uiActions: UIActions) {}

    startCooking() {

    }

    enableCookmode() {
        this.uiActions.enableCookmode();
    }

    disableCookmode() {
        this.uiActions.disableCookmode();
    }

    toggleKitchenSidebar() {
        this.sidebarDisplayed$.first().subscribe(isDisplayed => {
            if (isDisplayed) {
                this.uiActions.hideKitchenSidebar();
            } else {
                this.uiActions.showKitchenSidebar();
            }
        });
    }

    get cookmodeEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.cookmode;
        });
    }

    get sidebarDisplayed$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.kitchenSidebar.displayed;
        });
    }
}