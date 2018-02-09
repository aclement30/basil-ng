import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { AppState } from './index';

class ShowKitchenSidebar implements Action {
  readonly type = UIActions.SHOW_KITCHEN_SIDEBAR;
}

class ToggleKitchenSidebar implements Action {
  readonly type = UIActions.TOGGLE_KITCHEN_SIDEBAR;
}

class HideKitchenSidebar implements Action {
  readonly type = UIActions.HIDE_KITCHEN_SIDEBAR;
}

class ShowNavigationMenu implements Action {
  readonly type = UIActions.SHOW_NAVIGATION_MENU;
}

class HideNavigationMenu implements Action {
  readonly type = UIActions.HIDE_NAVIGATION_MENU;
}

export class EnableCookmode implements Action {
  readonly type = UIActions.ENABLE_COOKMODE;
}

export class DisableCookmode implements Action {
  readonly type = UIActions.DISABLE_COOKMODE;
}

class EnableVoiceAssistant implements Action {
  readonly type = UIActions.ENABLE_VOICE_ASSISTANT;
}

class DisableVoiceAssistant implements Action {
  readonly type = UIActions.DISABLE_VOICE_ASSISTANT;
}

class StartListening implements Action {
  readonly type = UIActions.START_LISTENING;
}

class StopListening implements Action {
  readonly type = UIActions.STOP_LISTENING;
}

@Injectable()
export class UIActions {
  constructor (private store: Store<AppState>) {}

  static SHOW_KITCHEN_SIDEBAR = 'SHOW_KITCHEN_SIDEBAR';
  static TOGGLE_KITCHEN_SIDEBAR = 'TOGGLE_KITCHEN_SIDEBAR';
  static HIDE_KITCHEN_SIDEBAR = 'HIDE_KITCHEN_SIDEBAR';
  static SHOW_NAVIGATION_MENU = 'SHOW_NAVIGATION_MENU';
  static HIDE_NAVIGATION_MENU = 'HIDE_NAVIGATION_MENU';
  static ENABLE_COOKMODE = 'ENABLE_COOKMODE';
  static DISABLE_COOKMODE = 'DISABLE_COOKMODE';
  static ENABLE_VOICE_ASSISTANT = 'ENABLE_VOICE_ASSISTANT';
  static DISABLE_VOICE_ASSISTANT = 'DISABLE_VOICE_ASSISTANT';
  static START_LISTENING = 'START_LISTENING';
  static STOP_LISTENING = 'STOP_LISTENING';

  showKitchenSidebar = (): void => {
    this.store.dispatch(new ShowKitchenSidebar());
  }

  toggleKitchenSidebar = (): void => {
    this.store.dispatch(new ToggleKitchenSidebar());
  }

  hideKitchenSidebar = (): void => {
    this.store.dispatch(new HideKitchenSidebar());
  }

  showNavigationMenu = (): void => {
    this.store.dispatch(new ShowNavigationMenu());
  }

  hideNavigationMenu = (): void => {
    this.store.dispatch(new HideNavigationMenu());
  }

  enableCookmode = (): void => {
    this.store.dispatch(new EnableCookmode());
  }

  disableCookmode = (): void => {
    this.store.dispatch(new DisableCookmode());
  }

  enableVoiceAssistant = (): void => {
    this.store.dispatch(new EnableVoiceAssistant());
  }

  disableVoiceAssistant = (): void => {
    this.store.dispatch(new DisableVoiceAssistant());
  }

  startListening = (): void => {
    this.store.dispatch(new StartListening());
  }

  stopListening = (): void => {
    this.store.dispatch(new StopListening());
  }
}
