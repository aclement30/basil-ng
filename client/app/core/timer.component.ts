import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Timer } from '../models/timer.model';
import { TimerService } from '../services/timer.service';

@Component({
    selector: 'timer',
    template: `
        <div class="wrapper">
            <h2 *ngIf="!timer.completed">{{ timerDisplay }}</h2>
            <div class="btn-group actions" *ngIf="!timer.completed">
                <button type="button" (click)="toggleStatus()" class="btn btn-default waves-effect" [disabled]="timer.completed">
                    <i class="zmdi zmdi-pause" *ngIf="timer.active"></i>
                    <i class="zmdi zmdi-play" *ngIf="!timer.active"></i>
                </button>
                <button type="button" (click)="stop()" class="btn btn-default waves-effect"><i class="zmdi zmdi-stop"></i></button>
            </div>
        </div>
        <div class="progress" *ngIf="!timer.completed">
            <div class="progress-bar progress-bar-success" role="progressbar" [style.width]="elapsedPercentage + '%'"></div>
        </div>
        <div class="wrapper">
            <div class="completed" *ngIf="timer.completed">
                <i class="zmdi zmdi-check-circle" *ngIf="timer.completed"></i>
            </div>
            <div class="description">
                <div class="title" *ngIf="timer.title">{{ timer.title }}</div>
                <div class="contextual-description" *ngIf="timer.contextualDescription">{{ timer.contextualDescription }}</div>
                <small *ngIf="timer.recipeStep">{{ 'common.step' | translate }} {{ timer.recipeStep }}</small>
            </div>
        </div>
    `,
    styleUrls: ['timer.component.scss'],
})

export class TimerComponent implements OnInit {

    @Input() timer: Timer;

    constructor (
        private timerService: TimerService) {}

    ngOnInit() {}

    toggleStatus() {
        if (this.timer.active) {
            this.timerService.pause(this.timer);
        } else {
            this.timerService.start(this.timer);
        }
    }

    stop() {
        this.timerService.stop(this.timer, true);
    }

    get timerDisplay(): string {
        const remainingSeconds = this.timer.remainingTime;
        let format: string = '';

        if (remainingSeconds >= 3600) {
            format += 'HH:';
        }
        format += 'mm:ss';

        return moment.utc(remainingSeconds * 1000).format(format);
    }

    get elapsedPercentage(): number {
        return Math.round((this.timer.originalDuration - this.timer.remainingTime) / this.timer.originalDuration * 100);
    }
}
