import { IUI } from '../redux';
import { UIActions } from '../core/redux.actions';

export const INITIAL_STATE: IUI = {
    cookmode: false,
    kitchenSidebar: {
        displayed: false,
    },
}

export function uiReducer(state: IUI = INITIAL_STATE, action: any): IUI {
    if (!action.type) {
        return state;
    }

    let newState = Object.assign({}, state);

    switch (action.type) {
        case UIActions.SHOW_KITCHEN_SIDEBAR:
            newState.kitchenSidebar.displayed = true;
            return newState;

        case UIActions.HIDE_KITCHEN_SIDEBAR:
            newState.kitchenSidebar.displayed = false;
            return newState;

        case UIActions.ENABLE_COOKMODE:
            newState.cookmode = true;
            return newState;

        case UIActions.DISABLE_COOKMODE:
            newState.cookmode = false;
            return newState;

        default:
            return state;
    }
}
