import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

import { DialogService } from './dialog.service';

export interface IWindow extends Window {
    SpeechSynthesisUtterance: any;
    speechSynthesis: any;
}

export class SpeakerOptions {
    dialogTitle? = '';
    dialogText?: string;
    dialogCloseDelay? = 0;
    chime? = false;
    ding? = false;
}

const { SpeechSynthesisUtterance }: IWindow = <IWindow>window;
const { speechSynthesis }: IWindow = <IWindow>window;

@Injectable()
export class SpeakerService {
    public speaking: EventEmitter<boolean> = new EventEmitter<boolean>();
    private _message: any;  // Speech message is stored locally to avoid GC destruction before onEnd callback

    constructor(
        private dialogService: DialogService,
        private translate: TranslateService,
    ) {}

    async speak(text: string, options: SpeakerOptions = {}) {
        this._message = new SpeechSynthesisUtterance();
        this._message.lang = this.translate.currentLang === 'fr' ? 'fr-FR' : 'en-CA';
        this._message.rate = 1.2;
        this._message.text = text;

        this._message.onend = this.stopSpeaking(options);

        this.speaking.emit(true);

        if (options.chime) {
            await this.chime();
        }

        if (options.ding) {
            await this.ding();
        }

        this.dialogService.show(options.dialogTitle, options.dialogText ? options.dialogText : text);
        speechSynthesis.speak(this._message);

        // Failsafe in the event SpeechSynthesis does not call onend callback
        setTimeout(this.stopSpeaking(options), this.getWaitTime(text));
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

    stopSpeaking(options) {
        return () => {
            setTimeout(this.dialogService.close, options.dialogCloseDelay);

            this.speaking.emit(false);
        };
    }

    getWaitTime(text) {
        const wpm = 180;        // Readable words per minute
        const wordLength = 5;   // Standardized number of chars in calculable word
        const delay = 500;     // Milliseconds before user starts reading the notification
        const bonus = 500;     // Extra time

        const words = text.length / wordLength;
        const wordsTime = ((words / wpm) * 60) * 1000;

        return delay + wordsTime + bonus;
    }
}
