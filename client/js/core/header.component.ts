import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityService } from './security.service';

@Component({
    selector: 'header',
    providers: [ SecurityService ],
    template: `
        <div class="pull-left h-logo">
            <a [routerLink]="['/']" class="hidden-xs">
                Basil
                <small>Livre de recettes</small>
            </a>
            
            <div class="menu-collapse" data-ma-action="sidebar-open" data-ma-target="main-menu">
                <div class="mc-wrap">
                    <div class="mcw-line top palette-White bg"></div>
                    <div class="mcw-line center palette-White bg"></div>
                    <div class="mcw-line bottom palette-White bg"></div>
                </div>
            </div>
        </div>
        
        <div class="pull-left add-recipe">
            <a [routerLink]="['add']">
                <i class="zmdi zmdi-plus"></i>
            </a>
        </div>
        
        <ul class="pull-right h-menu">
            <li class="hm-add-recipe">
                <a [routerLink]="['add']">
                    <i class="hm-icon zmdi zmdi-plus"></i>
                </a>
            </li>
            <li class="hm-search-trigger">
                <a href="" data-ma-action="search-open">
                    <i class="hm-icon zmdi zmdi-search"></i>
                </a>
            </li>
            <li ngbDropdown class="hm-profile">
                <a ngbDropdownToggle>
                    <i class="hm-icon zmdi zmdi-account-circle"></i>
                </a>
                
                <ul class="dropdown-menu pull-right dm-icon">
                    <li class="dropdown-item">
                        <a (click)="logout()"><i class="zmdi zmdi-time-restore"></i> Déconnexion</a>
                    </li>
                </ul>
            </li>
        </ul>
        
        <div class="media-body h-search">
            <form class="p-relative">
                <input type="text" class="hs-input" placeholder="Rechercher une recette">
                <i class="zmdi zmdi-search hs-reset" data-ma-action="search-clear"></i>
            </form>
        </div>
    `
})

export class HeaderComponent {

    constructor(
        private router: Router,
        private securityService: SecurityService
    ) {}

    logout() {
        this.securityService.logout().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}