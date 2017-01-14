import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../app.config';
import { SecurityService } from './security.service';
import { UIActions } from './redux.actions';

@Component({
    selector: 'header',
    providers: [ SecurityService ],
    template: `
        <div class="pull-left h-logo">
            <a [routerLink]="['/']" class="hidden-xs">
                Basil
                <small>Livre de recettes</small>
            </a>
            
            <div class="menu-collapse" (click)="toggleSidebar()">
                <div class="mc-wrap">
                    <div class="mcw-line top"></div>
                    <div class="mcw-line center"></div>
                    <div class="mcw-line bottom"></div>
                </div>
            </div>
        </div>
        
        <ul class="pull-right h-menu">
            <li *ngIf="vocalAssistant">
                <button voice-assistant-button title="Assistant vocal"></button>
            </li>
            <li>
                <button cookmode-button title="Cookmode"></button>
            </li>
            <li>
                <button kitchen-sidebar-button class="larger" title="Recettes en cours"></button>
            </li>
            <!--<li class="hm-search-trigger">-->
                <!--<a class="larger">-->
                    <!--<i class="zmdi zmdi-search"></i>-->
                <!--</a>-->
            <!--</li>-->
            <li ngbDropdown class="hm-profile">
                <a ngbDropdownToggle class="larger">
                    <i class="zmdi zmdi-account-o"></i>
                </a>
                
                <ul class="dropdown-menu pull-right dm-icon">
                    <li class="dropdown-item">
                        <a (click)="logout()"><i class="zmdi zmdi-time-restore"></i> Déconnexion</a>
                    </li>
                </ul>
            </li>
        </ul>
        
        <!--<div class="media-body h-search">-->
            <!--<form class="p-relative">-->
                <!--<input type="text" class="hs-input" placeholder="Rechercher une recette">-->
                <!--<i class="zmdi zmdi-search hs-reset" data-ma-action="search-clear"></i>-->
            <!--</form>-->
        <!--</div>-->
    `
})

export class HeaderComponent {
    public vocalAssistant: boolean = APP_CONFIG.canSpeechRecognition;

    constructor(
        private router: Router,
        private securityService: SecurityService,
        private uiActions: UIActions
    ) {}

    toggleSidebar() {
        this.uiActions.showSidebar();
    }

    logout() {
        this.securityService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}