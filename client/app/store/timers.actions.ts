import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ActionWithPayload, AppState } from './index';
import { Timer } from '../models/timer.model';

class SetTimers implements ActionWithPayload {
  readonly type = TimersActions.SET_TIMERS;
  constructor(public payload: Timer[]) {}
}

class AddTimer implements ActionWithPayload {
  readonly type = TimersActions.ADD_TIMER;
  constructor(public payload: Timer) {}
}

class StartTimer implements ActionWithPayload {
  readonly type = TimersActions.START_TIMER;
  constructor(public payload: Timer) {}
}

class UpdateTimer implements ActionWithPayload {
  readonly type = TimersActions.UPDATE_TIMER;
  constructor(public payload: Timer) {}
}

class CompleteTimer implements ActionWithPayload {
  readonly type = TimersActions.COMPLETE_TIMER;
  constructor(public payload: Timer) {}
}

class RemoveTimer implements ActionWithPayload {
  readonly type = TimersActions.REMOVE_TIMER;
  constructor(public payload: Timer) {}
}

@Injectable()
export class TimersActions {
  constructor (private store: Store<AppState>) {}

  static SET_TIMERS = 'SET_TIMERS';
  static ADD_TIMER = 'ADD_TIMER';
  static START_TIMER = 'START_TIMER';
  static UPDATE_TIMER = 'UPDATE_TIMER';
  static COMPLETE_TIMER = 'COMPLETE_TIMER';
  static REMOVE_TIMER = 'REMOVE_TIMER';

  setTimers = (timers: Timer[]): void => {
    this.store.dispatch(new SetTimers(timers));
  }

  addTimer = (timer: Timer): void => {
    this.store.dispatch(new AddTimer(timer));
  }

  startTimer = (timer: Timer): void => {
    this.store.dispatch(new StartTimer(timer));
  }

  updateTimer = (timer: Timer): void => {
    this.store.dispatch(new UpdateTimer(timer));
  }

  completeTimer = (timer: Timer): void => {
    this.store.dispatch(new CompleteTimer(timer));
  }

  removeTimer = (timer: Timer): void => {
    this.store.dispatch(new RemoveTimer(timer));
  }
}
