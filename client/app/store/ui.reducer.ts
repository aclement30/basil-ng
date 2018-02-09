import { Action, createSelector } from '@ngrx/store';

import { AppState } from './index';
import { UIActions } from './ui.actions';

export interface IKitchenSidebar {
  displayed: boolean;
}

export interface INavigationMenu {
  displayed: boolean;
}

export interface IVoiceAssistant {
  enabled: boolean;
  listening: boolean;
}

export interface UIState {
  cookmode: boolean;
  kitchenSidebar: IKitchenSidebar;
  navigationMenu: INavigationMenu;
  voiceAssistant: IVoiceAssistant;
}

export const INITIAL_STATE: UIState = {
    cookmode: false,
    kitchenSidebar: {
        displayed: false,
    },
    navigationMenu: {
        displayed: false,
    },
    voiceAssistant: {
        enabled: false,
        listening: false,
    },
}

export function uiReducer(state: UIState = INITIAL_STATE, action: Action): UIState {
    switch (action.type) {
        case UIActions.SHOW_KITCHEN_SIDEBAR:
          return {
            ...state,
            kitchenSidebar: {
              ...state.kitchenSidebar,
              displayed: true,
            },
          };

        case UIActions.TOGGLE_KITCHEN_SIDEBAR:
          return {
            ...state,
            kitchenSidebar: {
              ...state.kitchenSidebar,
              displayed: !state.kitchenSidebar.displayed,
            },
          };

        case UIActions.HIDE_KITCHEN_SIDEBAR:
          return {
            ...state,
            kitchenSidebar: {
              ...state.kitchenSidebar,
              displayed: false,
            },
          };

        case UIActions.SHOW_NAVIGATION_MENU:
          return {
            ...state,
            navigationMenu: {
              ...state.navigationMenu,
              displayed: true,
            },
          };

        case UIActions.HIDE_NAVIGATION_MENU:
          return {
            ...state,
            navigationMenu: {
              ...state.navigationMenu,
              displayed: false,
            },
          };

        case UIActions.ENABLE_COOKMODE:
          return {
            ...state,
            cookmode: true,
          };

        case UIActions.DISABLE_COOKMODE:
          return {
            ...state,
            cookmode: false,
          };

        case UIActions.ENABLE_VOICE_ASSISTANT:
          return {
            ...state,
            voiceAssistant: {
              ...state.voiceAssistant,
              enabled: true,
            },
          };

        case UIActions.DISABLE_VOICE_ASSISTANT:
          return {
            ...state,
            voiceAssistant: {
              ...state.voiceAssistant,
              enabled: false,
            },
          };

        case UIActions.START_LISTENING:
          return {
            ...state,
            voiceAssistant: {
              ...state.voiceAssistant,
              listening: true,
            },
          };

        case UIActions.STOP_LISTENING:
          return {
            ...state,
            voiceAssistant: {
              ...state.voiceAssistant,
              listening: false,
            },
          };

        default:
          return state;
    }
}

export const getUIState = (state: AppState) => (state.ui);
export const getCookmode = createSelector(getUIState, (ui: UIState) => (ui.cookmode));
export const getKitchenSidebar = createSelector(getUIState, (ui: UIState) => (ui.kitchenSidebar));
export const getNavigationMenu = createSelector(getUIState, (ui: UIState) => (ui.navigationMenu));
export const getVoiceAssistant = createSelector(getUIState, (ui: UIState) => (ui.voiceAssistant));
