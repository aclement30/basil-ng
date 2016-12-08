import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { NgReduxModule } from 'ng2-redux';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgRedux } from 'ng2-redux';
import { IAppState, enhancers, rootReducer } from './redux';
import * as createLogger from 'redux-logger';

import { AppComponent } from './core/app.component';
import { CookmodeMenuComponent } from './core/cookmode-menu.component';
import { DashboardComponent } from './core/dashboard.component';
import { FooterComponent } from './core/footer.component';
import { HeaderComponent } from './core/header.component';
import { MainComponent } from './core/main.component';
import { SidebarComponent } from './core/sidebar.component';

import { LoginModule } from './login/login.module';
import { RecipesModule } from './recipes/recipes.module';

import { AppRoutingModule } from './app.routing';

import { DialogService } from './core/dialog.service';
import { Gatekeeper } from './core/gatekeeper.service';
import { NotificationService } from './core/notification.service';
import { SecurityService } from './core/security.service';
import { RecipesActions, SessionActions, UIActions } from './core/redux.actions';

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
        SidebarComponent
    ],
    providers: [
        Gatekeeper,
        DialogService,
        NotificationService,
        RecipesActions,
        SecurityService,
        SessionActions,
        UIActions
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {
    constructor(private ngRedux: NgRedux<IAppState>) {
        this.ngRedux.configureStore(
            rootReducer,
            {
                cookingRecipes: {
                    list: [],
                },
                session: {
                    user: null,
                    loading: false,
                },
                ui: {
                    cookmode: false,
                    kitchenSidebar: {
                        displayed: false,
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
    }
}