import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { ActionWithPayload, AppState } from './index';
import { User } from '../models/user.model';

class SetUser implements ActionWithPayload {
  readonly type = SessionActions.SET_USER;
  constructor(public payload: User) {}
}

class ResetUser implements Action {
  readonly type = SessionActions.RESET_USER;
}

class StartLoading implements Action {
  readonly type = SessionActions.START_LOADING;
}

class StopLoading implements Action {
  readonly type = SessionActions.STOP_LOADING;
}

@Injectable()
export class SessionActions {
  constructor (private store: Store<AppState>) {}

  static SET_USER = 'SET_USER';
  static RESET_USER = 'RESET_USER';
  static START_LOADING = 'START_LOADING';
  static STOP_LOADING = 'STOP_LOADING';

  setUser = (user: User): void => {
    this.store.dispatch(new SetUser(user));
  }

  resetUser = (): void => {
    this.store.dispatch(new ResetUser());
  }

  startLoading = (): void => {
    this.store.dispatch(new StartLoading());
  }

  stopLoading = (): void => {
    this.store.dispatch(new StopLoading());
  }
}
