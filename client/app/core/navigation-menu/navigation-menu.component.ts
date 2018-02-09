import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SecurityService } from '../../services/security.service';
import { RecipeSummary } from '../../models/recipe.model';
import { Timer } from '../../models/timer.model';
import { UIActions } from '../../store/ui.actions';
import { AppState } from '../../store/index';
import { getTimers } from '../../store/timers.reducer';
import { getCookingRecipes } from '../../store/cooking-recipes.reducer';
import { getNavigationMenu, INavigationMenu } from '../../store/ui.reducer';

@Component({
    selector: 'navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss'],
})

export class NavigationMenuComponent implements OnInit, OnDestroy {
    cookingRecipes$: Observable<RecipeSummary[]>;
    timers$: Observable<Timer[]>;

    @HostBinding('class.toggled') menuDisplayed = false;

    private subscriptions: Subscription = Observable.never().subscribe();

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private store: Store<AppState>,
        private uiActions: UIActions,
    ) {}

    ngOnInit() {
        this.cookingRecipes$ = this.store.select(getCookingRecipes);
        this.timers$ = this.store.select(getTimers);

        this.subscriptions.add(
          this.store.select(getNavigationMenu)
            .subscribe((navigationMenu: INavigationMenu) => {
              this.menuDisplayed = navigationMenu.displayed;
            }),
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
