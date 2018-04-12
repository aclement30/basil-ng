import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import './store/rxjs-operators';

import { AppComponent } from './core/app.component';

import { CoreModule } from './core/core.module';
import { GroceriesModule } from './groceries/groceries.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { RecipesModule } from './recipes/recipes.module';

import { AppRoutingModule } from './app.routing';

import { Timer } from './models/timer.model';
import { TimerService } from './services/timer.service';
import { AppState, reducers } from './store/index';
import { CookingRecipesEffects } from './store/cooking-recipes.effects';
import { CookingRecipesActions } from './store/cooking-recipes.actions';
import { SessionActions } from './store/session.actions';
import { TimersActions } from './store/timers.actions';
import { UIActions } from './store/ui.actions';
import { getTimers } from './store/timers.reducer';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CoreModule,
        EffectsModule.forRoot([CookingRecipesEffects]),
        FormsModule,
        GroceriesModule,
        HomeModule,
        HttpClientModule,
        LoginModule,
        NgbModule.forRoot(),
        RecipesModule,
        StoreModule.forRoot(reducers),
        StoreDevtoolsModule.instrument({
            maxAge: 10
        }),
        TagInputModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
    ],
    declarations: [],
    providers: [
        CookingRecipesActions,
        SessionActions,
        TimersActions,
        UIActions,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(
        private store: Store<AppState>,
        private timerService: TimerService,
        private translate: TranslateService,
    ) {
        // const enhancers = [
        //     persistState('session', { key: 'basil.session' }),
        //     persistState('timers', { key: 'basil.timers', deserialize: (data: string) => {
        //         const timers: Timer[] = [];
        //
        //         const unserializedState = JSON.parse(data);
        //         unserializedState.timers.forEach((timerData: TimerData) => {
        //             if (!timerData.completed) {
        //                 timers.push(new Timer(timerData));
        //             }
        //         });
        //
        //         return { timers };
        //     } }),
        // ];

        let timers: Timer[];
        this.store.select(getTimers).take(1).subscribe((stateTimers: Timer[]) => { timers = stateTimers; });
        timers.forEach((timer) => {
            this.timerService.start(timer);
        });

        this.translate.setDefaultLang('fr');

        // Use user-selected language or fallback on browser language
        const language = localStorage.getItem('basil-language') || this.translate.getBrowserLang();
        this.translate.use(language);
    }
}
