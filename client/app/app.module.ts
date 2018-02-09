import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

import { NgReduxModule } from 'ng2-redux';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgRedux } from 'ng2-redux';
import { createLogger } from 'redux-logger';
import * as persistState from 'redux-localstorage';

import { IAppState, rootReducer } from './redux';

import { AppComponent } from './core/app.component';

import { CoreModule } from './core/core.module';
import { GroceriesModule } from './groceries/groceries.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { RecipesModule } from './recipes/recipes.module';

import { AppRoutingModule } from './app.routing';

import { Timer, TimerData } from './core/timer.model';
import { TimerService } from './core/timer.service';
import { RecipesActions, SessionActions, TimersActions, UIActions } from './core/redux.actions';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CoreModule,
        FormsModule,
        GroceriesModule,
        HomeModule,
        HttpClientModule,
        LoginModule,
        NgbModule.forRoot(),
        NgReduxModule,
        RecipesModule,
        TagInputModule,
    ],
    declarations: [],
    providers: [
        RecipesActions,
        SessionActions,
        TimersActions,
        UIActions,
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(
        private ngRedux: NgRedux<IAppState>,
        private timerService: TimerService) {
        const enhancers = [
            persistState('session', { key: 'basil.session' }),
            persistState('timers', { key: 'basil.timers', deserialize: (data: string) => {
                const timers: Timer[] = [];

                const unserializedState = JSON.parse(data);
                unserializedState.timers.forEach((timerData: TimerData) => {
                    if (!timerData.completed) {
                        timers.push(new Timer(timerData));
                    }
                });

                return { timers };
            } }),
        ];

        this.ngRedux.configureStore(
            rootReducer,
            {
                cookingRecipes: {
                    list: [],
                    current: null,
                },
                session: {
                    user: null,
                    loading: false,
                },
                tags: {
                    list: [],
                    current: null,
                },
                timers: [],
                ui: {
                    cookmode: false,
                    kitchenSidebar: {
                        displayed: false,
                    },
                    navigationMenu: {
                        displayed: false,
                    },
                    voiceAssistant: {
                        enabled: false,
                        listening: false,
                    },
                },
            },
            [
                createLogger({
                    level: 'info',
                    collapsed: true
                })
            ],
            [ ...enhancers ]
        );

        const timers: Timer[] = this.ngRedux.getState().timers;
        timers.forEach((timer) => {
            this.timerService.start(timer);
        });
    }
}
