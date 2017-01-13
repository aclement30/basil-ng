import { Component, HostBinding, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';
import { Router } from '@angular/router';

import { SecurityService } from './security.service';
import { IUI } from '../redux';
import { UIActions } from './redux.actions';
import { Timer } from './timer.model';

@Component({
    selector: 'sidebar',
    template: `
        <aside class="sidebar">
            <div class="smm-header">
                <i class="zmdi zmdi-long-arrow-left" (click)="hideSidebar()"></i>
            </div>
            
            <ul class="main-menu">
                <li>
                    <a [routerLink]="['/recipes']"><i class="zmdi zmdi-apps"></i> Recettes</a>
                </li>
                <li>
                    <a [routerLink]="['add']"><i class="zmdi zmdi-plus"></i> Ajouter une recette</a>
                </li>
                <li>
                    <a (click)="logout()"><i class="zmdi zmdi-time-restore"></i> Déconnexion</a>
                </li>
            </ul>
            
            <div class="timers">
                    <timer *ngFor="let timer of timers$ | async" [timer]="timer"></timer>
            </div>
        </aside>
    `
})

export class SidebarComponent {
    @select('timers') timers$: Observable<Timer>;
    @select('ui') ui$: Observable<IUI>;
    @HostBinding('class.toggled') sidebarDisplayed: boolean = false;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private uiActions: UIActions) {
        this.ui$.subscribe((ui: IUI) => {
            this.sidebarDisplayed = ui.sidebar.displayed;
        });
    }

    @HostListener('click', ['$event']) onClick($event: MouseEvent) {
        const target: any = $event.target;
        const targetType = target.nodeName;

        if (targetType === 'A') {
            this.hideSidebar();
        }
    }

    hideSidebar() {
        this.uiActions.hideSidebar();
    }

    logout() {
        this.securityService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}