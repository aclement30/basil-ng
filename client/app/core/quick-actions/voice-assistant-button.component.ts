import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { getUIState, UIState } from '../../store/ui.reducer';
import { UIActions } from '../../store/ui.actions';
import { AppState } from '../../store/index';

@Component({
    selector: '[voice-assistant-button]',
    template: `
        <i class="zmdi zmdi-mic-off" *ngIf="!(voiceAssistantEnabled$ | async)"></i>
        <i class="zmdi zmdi-mic" *ngIf="(voiceAssistantEnabled$ | async) && !(voiceAssistantListening$ | async)"></i>
        <i class="zmdi zmdi-spinner zmdi-hc-spin" *ngIf="voiceAssistantListening$ | async"></i>
    `
})

export class VoiceAssistantButtonComponent implements OnInit {
    private ui$: Observable<UIState>;

    constructor(
        private store: Store<AppState>,
        private uiActions: UIActions
    ) {}

    ngOnInit() {
      this.ui$ = this.store.select(getUIState);
    }

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
        return this.ui$.map((ui: UIState) => {
            return ui.voiceAssistant.enabled;
        });
    }

    get voiceAssistantListening$(): Observable<boolean> {
        return this.ui$.map((ui: UIState) => {
            return ui.voiceAssistant.listening;
        });
    }
}
