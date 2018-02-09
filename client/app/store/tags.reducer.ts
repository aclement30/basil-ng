import { ActionWithPayload, AppState } from './index';
import { TagsActions } from './tags.actions';
import { Tag } from '../models/tag.model';

export interface TagsState {
  list: Tag[];
  current: Tag;
}

export const INITIAL_STATE: TagsState = {
    list: [],
    current: null,
}

export function tagsReducer(state: TagsState = INITIAL_STATE, action: ActionWithPayload): TagsState {
    switch (action.type) {
        case TagsActions.SET_TAGS:
            return {
              ...state,
              list: action.payload.slice(),
            };

        case TagsActions.SET_CURRENT_TAG: {
            return {
              ...state,
              current: action.payload,
            };
        }

        case TagsActions.RESET_CURRENT_TAG:
            return {
              ...state,
              current: null,
            };

        default:
            return state;
    }
}

export const getTags = (state: AppState) => (state.tags.list);
export const getCurrentTag = (state: AppState) => (state.tags.current);
