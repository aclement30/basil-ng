import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CookmodeButtonComponent } from './quick-actions/cookmode-button.component';
import { CookmodeMenuComponent } from './cookmode-menu.component';
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';
import { KitchenSidebarButtonComponent } from './quick-actions/kitchen-sidebar-button.component';
import { KitchenSidebarComponent } from './kitchen-sidebar.component';
import { MainComponent } from './main.component';
import { SidebarComponent } from './sidebar.component';
import { SnapUploaderComponent } from './snap-uploader.component';
import { TimerComponent } from './timer.component';
import { VoiceAssistantButtonComponent } from './quick-actions/voice-assistant-button.component';

import { CommandParser } from './command.parser';
import { DialogService } from './dialog.service';
import { Gatekeeper } from './gatekeeper.service';
import { NotificationService } from './notification.service';
import { OCRService } from './ocr.service';
import { SecurityService } from './security.service';
import { SpeakerService } from './speaker.service';
import { TimerService } from './timer.service';
import { VoiceAssistantService } from './voice-assistant.service';

@NgModule({
    imports: [ CommonModule, FormsModule, NgbModule, RouterModule ],
    declarations: [
        AppComponent,
        CookmodeButtonComponent,
        CookmodeMenuComponent,
        DashboardComponent,
        FooterComponent,
        HeaderComponent,
        KitchenSidebarButtonComponent,
        KitchenSidebarComponent,
        MainComponent,
        SidebarComponent,
        SnapUploaderComponent,
        TimerComponent,
        VoiceAssistantButtonComponent
    ],
    providers: [
        CommandParser,
        DialogService,
        Gatekeeper,
        NotificationService,
        OCRService,
        SecurityService,
        SpeakerService,
        TimerService,
        VoiceAssistantService,
    ],
    exports: [ SnapUploaderComponent, TimerComponent ]
})

export class CoreModule {
    constructor(private voiceAssistantService: VoiceAssistantService) {

    }
}