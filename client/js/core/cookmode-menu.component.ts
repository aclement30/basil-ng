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
                <button class="btn btn-primary btn-icon waves-effect waves-circle waves-float" (click)="toggleVoiceAssistant()">
                    <i class="zmdi zmdi-mic-off" *ngIf="!(voiceAssistantEnabled$ | async)"></i>
                    <i class="zmdi zmdi-mic" *ngIf="(voiceAssistantEnabled$ | async) && !(voiceAssistantListening$ | async)"></i>
                    <i class="zmdi zmdi-spinner zmdi-hc-spin" *ngIf="voiceAssistantListening$ | async"></i>
                </button>
            </li>
            <li>
                <button class="btn btn-primary btn-icon waves-effect waves-circle waves-float" (click)="toggleCookmode()">
                    <i class="zmdi zmdi-fullscreen-alt" *ngIf="!(cookmodeEnabled$ | async)"></i>
                    <i class="zmdi zmdi-fullscreen-exit" *ngIf="cookmodeEnabled$ | async"></i>
                </button>
            </li>
            <!--<li data-user-alert="sua-notifications" data-ma-action="sidebar-open" data-ma-target="user-alerts">
                <i class="zmdi zmdi-notifications"></i>
            </li>-->
            <li>
                <button class="btn btn-primary btn-icon waves-effect waves-circle waves-float" (click)="toggleKitchenSidebar()">
                    <i class="zmdi zmdi-view-list-alt"></i>
                </button>
            </li>
        </ul>
    `,
    host: {
        '(document:keydown)': 'onKeyDown($event)'
    }
})

export class CookmodeMenuComponent {
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private route: ActivatedRoute,
        private uiActions: UIActions) {}

    startCooking() {

    }

    toggleCookmode() {
        this.cookmodeEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableCookmode();
            } else {
                this.uiActions.enableCookmode();
            }
        });
    }

    toggleVoiceAssistant() {
        this.voiceAssistantEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableVoiceAssistant();
            } else {
                this.uiActions.enableVoiceAssistant();
            }
        });
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

    onKeyDown = ($event: KeyboardEvent) => {
        const keyCode = $event.which || $event.keyCode;
        const target: any = $event.target;
        const targetType = target.nodeName;

        if (keyCode !== 32 || targetType === 'INPUT' || targetType === 'TEXTAREA') {
            return;
        }

        $event.preventDefault();
        this.toggleVoiceAssistant();
    }

    get cookmodeEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.cookmode;
        });
    }

    get voiceAssistantEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.voiceAssistant.enabled;
        });
    }

    get voiceAssistantListening$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.voiceAssistant.listening;
        });
    }

    get sidebarDisplayed$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.kitchenSidebar.displayed;
        });
    }
}