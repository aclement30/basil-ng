import { TimersActions } from './redux.actions';
import { Timer } from './timer.model';

export const INITIAL_STATE: Timer[] = [];

export function timersReducer(state: Timer[] = INITIAL_STATE, action: any): Timer[] {
    if (!action.type) {
        return state;
    }

    const newState = state.slice();

    switch (action.type) {
        case TimersActions.SET_TIMERS:
            return action.payload.timers.slice();

        case TimersActions.ADD_TIMER:
            newState.push(action.payload.timer);
            return newState;

        case TimersActions.START_TIMER:
        case TimersActions.COMPLETE_TIMER:
        case TimersActions.UPDATE_TIMER: {
            const INDEX = newState.findIndex(existingTimer => (existingTimer.id === action.payload.timer.id));
            newState.splice(INDEX, 1, action.payload.timer);
            return newState;
        }

        case TimersActions.REMOVE_TIMER: {
            const INDEX = newState.findIndex(existingTimer => (existingTimer.id === action.payload.timer.id));
            newState.splice(INDEX, 1);
            return newState;
        }

        default:
            return state;
    }
}
