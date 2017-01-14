import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../redux';

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