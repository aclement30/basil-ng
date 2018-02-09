import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { Autosize } from './autosize.directive';
import { CapitalizePipe } from './filters/capitalize.pipe';
import { CookmodeButtonComponent } from './quick-actions/cookmode-button.component';
import { CookmodeMenuComponent } from './cookmode-menu.component';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header/header.component';
import { IngredientUnitPipe } from './filters/ingredient-unit.pipe';
import { KitchenSidebarButtonComponent } from './quick-actions/kitchen-sidebar-button.component';
import { KitchenSidebarComponent } from './kitchen-sidebar.component';
import { MainComponent } from './main.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { SnapUploaderComponent } from './snap-uploader.component';
import { TimerComponent } from './timer.component';
import { VoiceAssistantButtonComponent } from './quick-actions/voice-assistant-button.component';

import { CommandParser } from './command.parser';
import { DialogService } from '../services/dialog.service';
import { Gatekeeper } from '../services/gatekeeper.service';
import { NotificationService } from '../services/notification.service';
import { OCRService } from '../services/ocr.service';
import { SecurityService } from '../services/security.service';
import { SpeakerService } from '../services/speaker.service';
import { TimerService } from '../services/timer.service';
import { VoiceAssistantService } from '../services/voice-assistant.service';
import { Watchman } from "../services/watchman.service";

@NgModule({
    imports: [ CommonModule, FormsModule, NgbModule, RouterModule ],
    declarations: [
        AppComponent,
        Autosize,
        CapitalizePipe,
        CookmodeButtonComponent,
        CookmodeMenuComponent,
        FooterComponent,
        HeaderComponent,
        IngredientUnitPipe,
        KitchenSidebarButtonComponent,
        KitchenSidebarComponent,
        MainComponent,
        NavigationMenuComponent,
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
        Watchman,
    ],
    exports: [ Autosize, CapitalizePipe, IngredientUnitPipe, SnapUploaderComponent, TimerComponent ]
})

export class CoreModule {
    constructor(private voiceAssistantService: VoiceAssistantService, private watchman: Watchman) {

    }
}
