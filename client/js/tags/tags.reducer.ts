import { ITags } from '../redux';

import { TagsActions } from './tags.actions';

export const INITIAL_STATE: ITags = {
    list: [],
    current: null,
}

export function tagsReducer(state: ITags = INITIAL_STATE, action: any): ITags {
    if (!action.type) {
        return state;
    }

    let newState = Object.assign({}, state);

    switch (action.type) {
        case TagsActions.SET_TAGS:
            newState.list = action.payload.tags.slice();

            return newState;

        case TagsActions.SET_CURRENT_TAG: {
            newState.current = action.payload.tag;

            return newState;
        }

        case TagsActions.RESET_CURRENT_TAG:
            newState.current = null;

            return newState;

        default:
            return state;
    }
}
