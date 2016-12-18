import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../redux';
import { UIActions } from './redux.actions';
import { Timer } from './timer.model';

@Component({
    selector: 'sidebar',
    template: `
        <aside class="sidebar">
            <div class="smm-header">
                <i class="zmdi zmdi-long-arrow-left" data-ma-action="sidebar-close"></i>
            </div>

            <ul class="quick-actions">
                <li>
                    <button class="btn btn-primary btn-icon waves-effect waves-circle waves-float" (click)="toggleVoiceAssistant()">
                        <i class="zmdi zmdi-mic-off" *ngIf="!(voiceAssistantEnabled$ | async)"></i>
                        <i class="zmdi zmdi-mic" *ngIf="(voiceAssistantEnabled$ | async) && !(voiceAssistantListening$ | async)"></i>
                        <i class="zmdi zmdi-spinner zmdi-hc-spin" *ngIf="voiceAssistantListening$ | async"></i>
                    </button>
                </li>
                <li>
                    <button class="btn btn-icon waves-effect waves-circle waves-float" (click)="enableCookmode()" *ngIf="!(cookmodeEnabled$ | async)">
                        <i class="zmdi zmdi-fullscreen-alt"></i>
                    </button>
                    <button class="btn btn-icon waves-effect waves-circle waves-float" (click)="disableCookmode()" *ngIf="cookmodeEnabled$ | async">
                        <i class="zmdi zmdi-fullscreen-exit"></i>
                    </button>
                </li>
                <!--<li data-user-alert="sua-notifications" data-ma-action="sidebar-open" data-ma-target="user-alerts">
                    <i class="zmdi zmdi-notifications"></i>
                </li>-->
                <li>
                    <button class="btn btn-icon waves-effect waves-circle waves-float" (click)="toggleKitchenSidebar()">
                        <i class="zmdi zmdi-view-list-alt"></i>
                    </button>
                </li>
            </ul>

            <div class="timers">
                    <timer *ngFor="let timer of timers$ | async" [timer]="timer"></timer>
            </div>
            
            <!--<ul class="main-menu">
                <li class="active">
                    <a href="index.html"><i class="zmdi zmdi-home"></i> Home</a>
                </li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-view-compact"></i> Headers</a>

                    <ul>
                        <li><a href="alternative-header.html">Altenative</a></li>
                        <li><a href="colored-header.html">Colored</a></li>
                    </ul>
                </li>
                <li><a href="typography.html"><i class="zmdi zmdi-format-underlined"></i> Typography</a></li>
                <li><a href="widgets.html"><i class="zmdi zmdi-widgets"></i> Widgets</a></li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-view-list"></i> Tables</a>

                    <ul>
                        <li><a href="tables.html">Normal Tables</a></li>
                        <li><a href="data-tables.html">Data Tables</a></li>
                    </ul>
                </li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-collection-text"></i> Forms</a>

                    <ul>
                        <li><a href="form-elements.html">Basic Form Elements</a></li>
                        <li><a href="form-components.html">Form Components</a></li>
                        <li><a href="form-examples.html">Form Examples</a></li>
                        <li><a href="form-validations.html">Form Validation</a></li>
                    </ul>
                </li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-swap-alt"></i>User Interface</a>
                    <ul>
                        <li><a href="colors.html">Colors</a></li>
                        <li><a href="animations.html">Animations</a></li>
                        <li><a href="box-shadow.html">Box Shadow</a></li>
                        <li><a href="buttons.html">Buttons</a></li>
                        <li><a href="icons.html">Icons</a></li>
                        <li><a href="alerts.html">Alerts</a></li>
                        <li><a href="preloaders.html">Preloaders</a></li>
                        <li><a href="notification-dialog.html">Notifications & Dialogs</a></li>
                        <li><a href="media.html">Media</a></li>
                        <li><a href="components.html">Components</a></li>
                        <li><a href="other-components.html">Others</a></li>
                    </ul>
                </li>
                <li><a href="flot-charts.html"><i class="zmdi zmdi-trending-up"></i> Flot Charts</a></li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-image"></i>Photo Gallery</a>
                    <ul>
                        <li><a href="photos.html">Default</a></li>
                        <li><a href="photo-timeline.html">Timeline</a></li>
                    </ul>
                </li>
                <li><a href="calendar.html"><i class="zmdi zmdi-calendar"></i> Calendar</a></li>
                <li><a href="generic-classes.html"><i class="zmdi zmdi-layers"></i> Generic Classes</a></li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-collection-item"></i> Sample Pages</a>
                    <ul>
                        <li><a href="profile-about.html">Profile</a></li>
                        <li><a href="list-view.html">List View</a></li>
                        <li><a href="messages.html">Messages</a></li>
                        <li><a href="pricing-table.html">Pricing Table</a></li>
                        <li><a href="contacts.html">Contacts</a></li>
                        <li><a href="wall.html">Wall</a></li>
                        <li><a href="invoice.html">Invoice</a></li>
                        <li><a href="login.html">Login and Sign Up</a></li>
                        <li><a href="lockscreen.html">Lockscreen</a></li>
                        <li><a href="404.html">Error 404</a></li>
                    </ul>
                </li>
                <li class="sub-menu">
                    <a href="" data-ma-action="submenu-toggle"><i class="zmdi zmdi-menu"></i> 3 Level Menu</a>

                    <ul>
                        <li><a href="form-elements.html">Level 2 link</a></li>
                        <li><a href="form-components.html">Another level 2 Link</a></li>
                        <li class="sub-menu">
                            <a href="" data-ma-action="submenu-toggle">I have children too</a>

                            <ul>
                                <li><a href="">Level 3 link</a></li>
                                <li><a href="">Another Level 3 link</a></li>
                                <li><a href="">Third one</a></li>
                            </ul>
                        </li>
                        <li><a href="form-validations.html">One more 2</a></li>
                    </ul>
                </li>
            </ul>-->
        </aside>
    `
})

export class SidebarComponent {
    @select('timers') timers$: Observable<Timer>;
    @select('ui') ui$: Observable<IUI>;

    constructor(private uiActions: UIActions) {
    }

    enableCookmode() {
        this.uiActions.enableCookmode();
    }

    disableCookmode() {
        this.uiActions.disableCookmode();
    }

    toggleKitchenSidebar() {
        this.uiActions.showKitchenSidebar();
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

    get cookmodeEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.cookmode;
        });
    }
}