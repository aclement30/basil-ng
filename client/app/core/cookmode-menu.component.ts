import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG } from '../app.config';
import { Store } from '@ngrx/store';
import { AppState } from '../store/index';
import { getUIState, UIState } from '../store/ui.reducer';
import { UIActions } from '../store/ui.actions';

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
    },
    styleUrls: ['cookmode-menu.component.scss'],
})

export class CookmodeMenuComponent implements OnInit {
    public vocalAssistant: boolean = APP_CONFIG.canSpeechRecognition;
    private ui$: Observable<UIState>;

    constructor(
        private store: Store<AppState>,
        private uiActions: UIActions
    ) {}

    ngOnInit() {
      this.ui$ = this.store.select(getUIState);
    }

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
        return this.ui$.map((ui: UIState) => {
            return ui.voiceAssistant.enabled;
        });
    }
}
