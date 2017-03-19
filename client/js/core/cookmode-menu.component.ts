import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { APP_CONFIG } from '../app.config';
import { IUI } from '../redux';
import { UIActions } from './redux.actions';

@Component({
    selector: 'cookmode-menu',
    template: `
        <ul class="quick-actions">
            <li *ngIf="vocalAssistant">
                <button voice-assistant-button title="Assistant vocal"></button>
            </li>
            <li>
                <button cookmode-button title="Cookmode"></button>
            </li>
            <!--<li>
                <button kitchen-sidebar-button class="larger" title="Recettes en cours"></button>
            </li>-->
        </ul>
    `,
    host: {
        '(document:keydown)': 'onKeyDown($event)'
    }
})

export class CookmodeMenuComponent {
    @select('ui') ui$: Observable<IUI>;
    public vocalAssistant: boolean = APP_CONFIG.canSpeechRecognition;

    constructor(
        private uiActions: UIActions) {}

    toggleVoiceAssistant() {
        this.voiceAssistantEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableVoiceAssistant();
            } else {
                this.uiActions.enableVoiceAssistant();
            }
        });
    }

    onKeyDown = ($event: KeyboardEvent) => {
        const keyCode = $event.which || $event.keyCode;
        const target: any = $event.target;
        const targetType = target.nodeName;

        if (keyCode !== 32 || targetType === 'INPUT' || targetType === 'TEXTAREA') {
            return;
        }

        $event.preventDefault();
        this.toggleVoiceAssistant();
    }

    get voiceAssistantEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.voiceAssistant.enabled;
        });
    }
}