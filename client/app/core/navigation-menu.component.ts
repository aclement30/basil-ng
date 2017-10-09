import { Component, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { SecurityService } from './security.service';
import { RecipeSummary } from "../recipes/recipe.model";
import { IUI, ICookingRecipes } from '../redux';
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
                <li class="sub-menu recipes toggled">
                    <a (click)="navigateTo(['/recipes'])"><i class="zmdi zmdi-apps"></i> Recettes</a>
                    <ul class="cooking-recipes">
                        <li *ngFor="let recipe of recipes$ | async">
                            <a (click)="navigateTo(['/recipes/detail', recipe._id])">{{ recipe.title }}</a>
                        </li>
                    </ul>
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
    `,
    styleUrls: ['navigation-menu.component.scss'],
})

export class NavigationMenuComponent {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
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

    get recipes$(): Observable<RecipeSummary[]> {
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.list;
        });
    }
}
