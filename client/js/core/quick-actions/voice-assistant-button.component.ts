import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { IUI } from '../../redux';
import { UIActions } from '../redux.actions';

@Component({
    selector: '[voice-assistant-button]',
    template: `
        <i class="zmdi zmdi-mic-off" *ngIf="!(voiceAssistantEnabled$ | async)"></i>
        <i class="zmdi zmdi-mic" *ngIf="(voiceAssistantEnabled$ | async) && !(voiceAssistantListening$ | async)"></i>
        <i class="zmdi zmdi-spinner zmdi-hc-spin" *ngIf="voiceAssistantListening$ | async"></i>
    `
})

export class VoiceAssistantButtonComponent {
    @select('ui') ui$: Observable<IUI>;

    constructor(
        private uiActions: UIActions) {}

    @HostListener('click') toggleVoiceAssistant() {
        this.voiceAssistantEnabled$.first().subscribe(isEnabled => {
            if (isEnabled) {
                this.uiActions.disableVoiceAssistant();
            } else {
                this.uiActions.enableVoiceAssistant();
            }
        });
    }

    get voiceAssistantEnabled$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.voiceAssistant.enabled;
        });
    }

    get voiceAssistantListening$(): Observable<boolean> {
        return this.ui$.map((ui: IUI) => {
            return ui.voiceAssistant.listening;
        });
    }
}
