import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../redux';

@Component({
    selector: 'main',
    template: `
        <header></header>

        <navigation-menu></navigation-menu>
        <kitchen-sidebar></kitchen-sidebar>

        <router-outlet name="sidebar"></router-outlet>
        
        <section id="main">    
            <router-outlet></router-outlet>
            
            <footer></footer>
        </section>
        
        <cookmode-menu></cookmode-menu>
    `,
})

export class MainComponent {
    @select('ui') ui$: Observable<IUI>;
    @HostBinding('class.cookmode') cookmodeEnabled: boolean = false;

    constructor (private router: Router) {
        this.ui$.subscribe((ui: IUI) => {
            this.cookmodeEnabled = ui.cookmode;
        });
    }

    logout(): void {
        this.router.navigate(['/login']);
    }
}