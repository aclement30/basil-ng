import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { ICookingRecipes } from '../redux';
import { Recipe } from '../recipes/recipe.model';
import { TimersActions } from './redux.actions';
import { Timer, TimerData } from './timer.model';
import { SpeakerService, SpeakerOptions } from './speaker.service';

@Injectable()
export class TimerService {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;

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
                this.currentRecipe$.first().subscribe((currentRecipe: Recipe) => {
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
                });
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

    get currentRecipe$(): Observable<Recipe> {
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.current;
        });
    }

    private _tick = (timer: Timer) => {
        if (timer.remainingTime <= 0) {
            this.stop(timer);
            return;
        }
    }
}