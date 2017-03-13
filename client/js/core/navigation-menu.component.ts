import { Component, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { SecurityService } from './security.service';
import { IUI } from '../redux';
import { UIActions } from './redux.actions';
import { Timer } from './timer.model';

@Component({
    selector: 'navigation-menu',
    template: `
        <aside class="menu">
            <div class="smm-header">
                <i class="zmdi zmdi-long-arrow-left" (click)="hideMenu()"></i>
            </div>
            
            <ul class="main-menu">
                <li>
                    <a (click)="navigateTo(['/recipes'])"><i class="zmdi zmdi-apps"></i> Recettes</a>
                </li>
                <li>
                    <a (click)="navigateTo(['/recipes/add'])"><i class="zmdi zmdi-plus"></i> Ajouter une recette</a>
                </li>
                <li>
                    <a (click)="navigateTo(['/groceries'])"><i class="zmdi zmdi-assignment"></i> Liste de courses</a>
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

export class NavigationMenuComponent {
    @select('timers') timers$: Observable<Timer>;
    @select('ui') ui$: Observable<IUI>;
    @HostBinding('class.toggled') menuDisplayed: boolean = false;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private uiActions: UIActions) {
        this.ui$.subscribe((ui: IUI) => {
            this.menuDisplayed = ui.navigationMenu.displayed;
        });
    }

    @HostListener('click', ['$event']) onClick($event: MouseEvent) {
        const target: any = $event.target;
        const targetType = target.nodeName;

        if (targetType === 'A') {
            this.hideMenu();
        }
    }

    navigateTo(location: string[]) {
        this.router.navigate(location);

        this.hideMenu();
    }

    hideMenu() {
        this.uiActions.hideNavigationMenu();
    }

    logout() {
        this.securityService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}