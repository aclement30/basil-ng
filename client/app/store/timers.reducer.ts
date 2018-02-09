import { Timer } from '../models/timer.model';
import { ActionWithPayload, AppState } from './index';
import { TimersActions } from './timers.actions';

export const INITIAL_STATE: Timer[] = [];

export function timersReducer(state: Timer[] = INITIAL_STATE, action: ActionWithPayload): Timer[] {
    switch (action.type) {
        case TimersActions.SET_TIMERS:
            return action.payload.slice();

        case TimersActions.ADD_TIMER:
            return [
              ...state,
              action.payload,
            ];

        case TimersActions.START_TIMER:
        case TimersActions.COMPLETE_TIMER:
        case TimersActions.UPDATE_TIMER: {
            const INDEX = state.findIndex(existingTimer => (existingTimer.id === action.payload.id));
            return state.slice().splice(INDEX, 1, action.payload);
        }

        case TimersActions.REMOVE_TIMER:
            return state.filter(existingTimer => (existingTimer.id === action.payload.id));

        default:
            return state;
    }
}

export const getTimers = (state: AppState) => (state.timers);

