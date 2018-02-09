import { Component, HostListener } from '@angular/core';
import { UIActions } from '../../store/ui.actions';

@Component({
    selector: '[kitchen-sidebar-button]',
    template: '<i class="zmdi zmdi-view-list-alt"></i>',
})

export class KitchenSidebarButtonComponent {
    constructor(
        private uiActions: UIActions
    ) {}

    @HostListener('click') toggleKitchenSidebar() {
        this.uiActions.toggleKitchenSidebar();
    }
}
