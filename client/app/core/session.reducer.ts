import { ISession } from '../redux';
import { SessionActions } from './redux.actions';

export const INITIAL_STATE: ISession = {
    user: null,
    loading: false,
};

export function sessionReducer(state: ISession = INITIAL_STATE, action: any): ISession {
    if (!action.type) {
        return state;
    }

    let newState = Object.assign({}, state);

    switch (action.type) {
        case SessionActions.SET_USER:
            newState.user = Object.assign({}, action.payload.user);
            return newState;
        case SessionActions.RESET_USER:
            return INITIAL_STATE;
        case SessionActions.START_LOADING:
            return Object.assign(newState, { loading: true });
        case SessionActions.STOP_LOADING:
            return Object.assign(newState, { loading: false });
        default:
            return newState;
    }
}
