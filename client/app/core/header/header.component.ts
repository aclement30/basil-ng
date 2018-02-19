import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../app.config';
import { UIActions } from '../../store/ui.actions';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.scss'],
})

export class HeaderComponent {
    public vocalAssistant: boolean = APP_CONFIG.canSpeechRecognition;

    constructor(
        private router: Router,
        private authService: AuthService,
        private uiActions: UIActions,
    ) {}

    toggleSidebar() {
        this.uiActions.showNavigationMenu();
    }

    logout() {
        this.authService.logoutUser().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
