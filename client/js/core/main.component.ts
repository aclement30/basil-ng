import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../redux';
import { SecurityService } from './security.service';

class UI {
    section: string;
    addButton: boolean;
    backButton: boolean;
}

const DEFAULT_UI: UI = {
    section: null,
    addButton: true,
    backButton: true
};

@Component({
    selector: 'main',
    template: `
        <header></header>

        <section id="main">
            <sidebar></sidebar>
            <kitchen-sidebar></kitchen-sidebar>
            
            <section id="content">
                <div class="container">
                    <router-outlet></router-outlet>
                </div>
            </section>
            
            <footer></footer>
        </section>
        
        <cookmode-menu></cookmode-menu>
        <!--<md-sidenav-->
                <!--layout="column"-->
                <!--class="md-sidenav-left md-whiteframe-z2"-->
                <!--md-component-id="left"-->
                <!--md-is-locked-open="true"-->
                <!--ng-show="currentUser"-->
                <!--ng-cloak>-->
            <!--<md-list>-->
                <!--<md-list-item class="md-2-line" role="link" md-ink-ripple>-->
                    <!--<md-icon>dashboard</md-icon>-->
                    <!--<div class="md-list-item-text" ui-sref="recipes">-->
                        <!--<span class="md-body-2">Recettes</span>-->
                    <!--</div>-->
                <!--</md-list-item>-->
                <!--<md-divider></md-divider>-->
                <!--<md-subheader  class="md-no-sticky">Cuisine</md-subheader>-->
                <!--<md-list-item class="md-2-line" ng-repeat="recipe in cookingRecipes" role="link" md-ink-ripple>-->
                    <!--<div class="md-list-item-text" ui-sref="detail({ id: recipe._id })">-->
                        <!--<span class="md-body-2">{{recipe.title}}</span>-->
                    <!--</div>-->
                <!--</md-list-item>-->
            <!--</md-list>-->
        <!--</md-sidenav>-->
        <!---->
        <!--<div layout="column" class="relative content-wrapper" layout-fill data-ui-view role="main"></div>-->
    `,
})

export class MainComponent {
    @select('ui') ui$: Observable<IUI>;
    @HostBinding('class.cookmode') cookmodeEnabled: boolean = false;

    constructor(
        private router: Router,
        private securityService: SecurityService
    ) {
        this.ui$.subscribe((ui: IUI) => {
            this.cookmodeEnabled = ui.cookmode;
        });
    }

    toggleMenu(): void {
        //$mdSidenav('left').toggle();
    }

    closeMenu(): void {
        //$mdSidenav('left').close();
    }

    logout(): void {
        this.router.navigate(['/login']);
    }
}