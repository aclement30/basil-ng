import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { ActionWithPayload, AppState } from './index';
import { Tag } from '../models/tag.model';

class SetTags implements ActionWithPayload {
  readonly type = TagsActions.SET_TAGS;
  constructor(public payload: Tag[]) {}
}

class SetCurrentTag implements ActionWithPayload {
  readonly type = TagsActions.SET_CURRENT_TAG;
  constructor(public payload: Tag) {}
}

class ResetCurrentTag implements Action {
  readonly type = TagsActions.RESET_CURRENT_TAG;
}

@Injectable()
export class TagsActions {
    constructor (private store: Store<AppState>) {}

    static SET_TAGS = 'SET_TAGS';
    static SET_CURRENT_TAG = 'SET_CURRENT_TAG';
    static RESET_CURRENT_TAG = 'RESET_CURRENT_TAG';

    setTags = (tags: Tag[]): void => {
        this.store.dispatch(new SetTags(tags));
    }

    setCurrentTag = (tag: Tag): void => {
        this.store.dispatch(new SetCurrentTag(tag));
    }

    resetCurrentTag = (): void => {
        this.store.dispatch(new ResetCurrentTag());
    }
}
