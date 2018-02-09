import * as moment from 'moment';
import { UUID } from 'angular2-uuid';

export class TimerData {
    id?: string;
    startTime?: string;
    originalDuration?: number;
    duration?: number;
    title?: string;
    contextualDescription?: string;
    recipeId?: string;
    recipeStep?: number;
    active?: boolean;
    completed?: boolean;
}

export class Timer {
    id: string;
    duration: number;
    originalDuration: number;
    title?: string;
    contextualDescription?: string;
    recipeId: string;
    recipeStep: number;
    private _startTime: string;
    private _active: boolean = false;
    private _completed: boolean = false;
    private _interval: any;

    constructor(data: TimerData) {
        this.id = data.id || UUID.UUID();
        this.duration = data.duration;
        this.originalDuration = data.originalDuration || data.duration;
        this._active = data.active !== undefined ? data.active : true;
        this.title = data.title || null;
        this.contextualDescription = data.contextualDescription || null;
        this.recipeId = data.recipeId || null;
        this.recipeStep = data.recipeStep || null;

        if (this.duration === 0) {
            this._completed = true;
        }

        if (this._active) {
            this._startTime = data.startTime || moment().toISOString();
        } else {
            this._startTime = null;
        }
    }

    start(tickingFn: Function) {
        if (this.completed) {
            return false;
        }

        this._interval = setInterval(() => {
            tickingFn(this);
        }, 1000);

        if (!this._active) {
            this._startTime = moment().toISOString();
        }

        this._active = true;
    }

    pause() {
        clearInterval(this._interval);

        this.duration = this.remainingTime;
        this._active = false;
    }

    stop() {
        this.pause();
        this._completed = true;
    }

    get remainingTime(): number {
        if (this.active) {
            return this.duration - moment().diff(this.startTime, 'seconds');
        } else {
            return this.duration;
        }
    }

    get startTime(): string {
        return this._startTime;
    }

    get active(): boolean {
        return this._active;
    }

    get completed(): boolean {
        return this._completed;
    }

    toJSON(): TimerData {
        return {
            id: this.id,
            startTime: this.startTime,
            originalDuration: this.originalDuration,
            duration: this.duration,
            active: this.active,
            completed: this.completed,
            title: this.title,
            contextualDescription: this.contextualDescription,
            recipeId: this.recipeId,
            recipeStep: this.recipeStep,
        };
    }
}