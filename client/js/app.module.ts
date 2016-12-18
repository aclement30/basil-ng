import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { NgReduxModule } from 'ng2-redux';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgRedux } from 'ng2-redux';
import { IAppState, rootReducer } from './redux';
import * as createLogger from 'redux-logger';
const persistState = require('redux-localstorage');

import { AppComponent } from './core/app.component';
import { CookmodeMenuComponent } from './core/cookmode-menu.component';
import { DashboardComponent } from './core/dashboard.component';
import { FooterComponent } from './core/footer.component';
import { HeaderComponent } from './core/header.component';
import { MainComponent } from './core/main.component';
import { SidebarComponent } from './core/sidebar.component';
import { TimerComponent } from './core/timer.component';

import { LoginModule } from './login/login.module';
import { RecipesModule } from './recipes/recipes.module';

import { AppRoutingModule } from './app.routing';

import { CommandParser } from './core/command.parser';
import { DialogService } from './core/dialog.service';
import { Gatekeeper } from './core/gatekeeper.service';
import { NotificationService } from './core/notification.service';
import { SecurityService } from './core/security.service';
import { SpeakerService } from './core/speaker.service';
import { Timer, TimerData } from './core/timer.model';
import { TimerService } from './core/timer.service';
import { VoiceAssistantService } from './core/voice-assistant.service';
import { RecipesActions, SessionActions, TimersActions, UIActions } from './core/redux.actions';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        LoginModule,
        NgbModule.forRoot(),
        NgReduxModule.forRoot(),
        RecipesModule
    ],
    declarations: [
        AppComponent,
        CookmodeMenuComponent,
        DashboardComponent,
        FooterComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        TimerComponent,
    ],
    providers: [
        CommandParser,
        Gatekeeper,
        DialogService,
        NotificationService,
        RecipesActions,
        SecurityService,
        SessionActions,
        SpeakerService,
        TimerService,
        TimersActions,
        UIActions,
        VoiceAssistantService,
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
                timers: [],
                ui: {
                    cookmode: false,
                    kitchenSidebar: {
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