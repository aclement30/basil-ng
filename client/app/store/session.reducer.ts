import { ActionWithPayload, AppState } from './index';
import { SessionActions } from './session.actions';
import { User } from '../models/user.model';
import { createSelector } from '@ngrx/store';

export interface SessionState {
    user?: User;
    loading: boolean;
}

export const INITIAL_STATE: SessionState = {
    user: null,
    loading: false,
};

export function sessionReducer(state: SessionState = INITIAL_STATE, action: ActionWithPayload): SessionState {
    switch (action.type) {
        case SessionActions.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case SessionActions.RESET_USER:
            return INITIAL_STATE;
        case SessionActions.START_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SessionActions.STOP_LOADING:
            return {
              ...state,
              loading: false,
            };
        default:
            return state;
    }
}

export const getSessionState = (state: AppState) => (state.session);
export const getCurrentUser = createSelector(getSessionState, (state: SessionState) => (state.user));
