import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../models/recipe.model';
import { Timer, TimerData } from '../models/timer.model';
import { SpeakerService } from './speaker.service';
import { TimersActions } from '../store/timers.actions';
import { getCurrentCookingRecipe } from '../store/cooking-recipes.reducer';
import { AppState } from '../store/index';

@Injectable()
export class TimerService {
    constructor(
        private speakerService: SpeakerService,
        private store: Store<AppState>,
        private timersActions: TimersActions
    ) {}

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
              let currentRecipe;
              this.store.select(getCurrentCookingRecipe).take(1)
                .subscribe((recipe: Recipe) => {
                  currentRecipe = recipe;
                });

                setTimeout(() => {
                    let description: string;
                    if (currentRecipe && timer.recipeId === currentRecipe._id) {
                        if (timer.contextualDescription) {
                            description = `${timer.contextualDescription} : temps écoulé`;
                        } else {
                            description = 'Temps écoulé';
                        }
                    } else {
                        if (timer.title) {
                            description = `${timer.title} : temps écoulé`;
                        } else {
                            description = 'Temps écoulé';
                        }
                    }

                    this.speakerService.speak(description, {
                        dialogTitle: 'Minuterie',
                        chime: true,
                        dialogCloseDelay: 3000
                    });
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
