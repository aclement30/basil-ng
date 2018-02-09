import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../store/index';
import { getCookmode } from '../store/ui.reducer';

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
    styleUrls: ['main.component.scss'],
})

export class MainComponent implements OnInit, OnDestroy {
    @HostBinding('class.cookmode') cookmodeEnabled = false;

    private subscriptions: Subscription = Observable.never().subscribe();

    constructor (
      private router: Router,
      private store: Store<AppState>
    ) {}

    ngOnInit() {
      this.subscriptions.add(
        this.store.select(getCookmode)
          .subscribe((cookmode: boolean) => {
            this.cookmodeEnabled = cookmode;
          }),
      );
    }

    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }

    logout(): void {
        this.router.navigate(['/login']);
    }
}
