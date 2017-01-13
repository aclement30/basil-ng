import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';
import * as $ from 'jquery';

import { DialogService } from './dialog.service';
import { IUI } from '../redux';

export interface IWindow extends Window {
    SpeechSynthesisUtterance: any;
    speechSynthesis: any;
}

export class SpeakerOptions {
    dialogTitle?: string = '';
    dialogText?: string;
    dialogCloseDelay?: number = 0;
    chime?: boolean = false;
    ding?: boolean = false;
}

const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
const { speechSynthesis }: IWindow = <IWindow>window;

@Injectable()
export class SpeakerService {
    @select('ui') ui$: Observable<IUI>;
    public speaking: EventEmitter<boolean> = new EventEmitter<boolean>();
    private voiceAssistantEnabled: boolean = false;
    private _message: any;  // Speech message is stored locally to avoid GC destruction before onEnd callback

    constructor(
        private dialogService: DialogService) {
        this.ui$.subscribe(this.onUIChange);
    }

    onUIChange = (ui: IUI) => {
        if (ui.voiceAssistant.enabled !== this.voiceAssistantEnabled) {
            this.voiceAssistantEnabled = ui.voiceAssistant.enabled;
        }
    }

    async speak(text: string, options: SpeakerOptions = {}) {
        this._message = new SpeechSynthesisUtterance();
        this._message.lang = 'fr-FR';
        this._message.rate = 1.2;
        this._message.text = text;

        this._message.onend = () => {
            setTimeout(this.dialogService.close, options.dialogCloseDelay);

            this.speaking.emit(false);
        };

        this.speaking.emit(true);

        if (options.chime) {
            await this.chime();
        }

        if (options.ding) {
            await this.ding();
        }

        this.dialogService.show(options.dialogTitle, options.dialogText ? options.dialogText : text);
        speechSynthesis.speak(this._message);
    }

    chime() {
        const audioElement = <HTMLAudioElement>$('audio.chime-sound')[0];
        audioElement.play();

        return new Promise(r => setTimeout(r, 1500));
    }

    ding() {
        const audioElement = <HTMLAudioElement>$('audio.ding-sound')[0];
        audioElement.play();

        return new Promise(r => setTimeout(r, 500));
    }
}