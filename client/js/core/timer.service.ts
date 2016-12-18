import { Injectable } from '@angular/core';

import { TimersActions } from './redux.actions';
import { Timer, TimerData } from './timer.model';
import { SpeakerService, SpeakerOptions } from './speaker.service';

@Injectable()
export class TimerService {

    constructor(
        private speakerService: SpeakerService,
        private timersActions: TimersActions) {}

    create(duration: number, options: TimerData = {}) {
        const data = Object.assign({ duration }, options);

        const timer = new Timer(data);

        this.timersActions.addTimer(timer);

        if (timer.active) {
            this.start(timer);
        }
    }

    start(timer: Timer) {
        const interval = timer.start(this._tick);

        if (interval) {
            this.timersActions.startTimer(timer);
        }
    }

    pause(timer: Timer) {
        timer.pause();

        this.timersActions.updateTimer(timer);
    }

    stop(timer: Timer, silent: boolean = false) {
        timer.stop();

        if (!silent) {
            this.timersActions.completeTimer(timer);

            if (timer.completed) {
                setTimeout(() => {
                    let description: string;
                    if (timer.description) {
                        description = `${timer.description} : temps écoulé`;
                    } else {
                        description = 'Temps écoulé';
                    }
                    this.speakerService.speak(description, { dialogTitle: 'Minuterie', chime: true, dialogCloseDelay: 3000 });
                }, 1500);
            }

            setTimeout(() => {
                this.timersActions.removeTimer(timer);
            }, 5000);
        } else {
            this.timersActions.removeTimer(timer);
        }
    }

    remove(timer: Timer) {
        this.stop(timer, true);
    }

    private _tick = (timer: Timer) => {
        if (timer.remainingTime <= 0) {
            this.stop(timer);
            return;
        }
    }
}