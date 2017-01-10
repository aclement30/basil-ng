import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CookmodeMenuComponent } from './cookmode-menu.component';
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { KitchenSidebarComponent } from './kitchen-sidebar.component';
import { MainComponent } from './main.component';
import { SidebarComponent } from './sidebar.component';
import { TimerComponent } from './timer.component';

import { CommandParser } from './command.parser';
import { DialogService } from './dialog.service';
import { Gatekeeper } from './gatekeeper.service';
import { NotificationService } from './notification.service';
import { SecurityService } from './security.service';
import { SpeakerService } from './speaker.service';
import { TimerService } from './timer.service';
import { VoiceAssistantService } from './voice-assistant.service';

@NgModule({
    imports: [ CommonModule, FormsModule, RouterModule ],
    declarations: [
        AppComponent,
        CookmodeMenuComponent,
        DashboardComponent,
        FooterComponent,
        HeaderComponent,
        KitchenSidebarComponent,
        MainComponent,
        SidebarComponent,
        TimerComponent,
    ],
    providers: [
        CommandParser,
        DialogService,
        Gatekeeper,
        NotificationService,
        SecurityService,
        SpeakerService,
        TimerService,
        VoiceAssistantService,
    ],
    exports: [ TimerComponent ]
})

export class CoreModule {}