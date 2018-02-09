import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../app.config';
import { SecurityService } from '../security.service';
import { UIActions } from '../../store/ui.actions';

@Component({
    selector: 'header',
    providers: [ SecurityService ],
    templateUrl: './header.component.html',
    styleUrls: ['header.component.scss'],
})

export class HeaderComponent {
    public vocalAssistant: boolean = APP_CONFIG.canSpeechRecognition;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private uiActions: UIActions,
    ) {}

    toggleSidebar() {
        this.uiActions.showNavigationMenu();
    }

    logout() {
        this.securityService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
