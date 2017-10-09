import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';

import { IAppState } from '../redux';
import { Tag } from './tag.model';

@Injectable()
export class TagsActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SET_TAGS: string = 'SET_TAGS';
    static SET_CURRENT_TAG: string = 'SET_CURRENT_TAG';
    static RESET_CURRENT_TAG: string = 'RESET_CURRENT_TAG';

    setTags = (tags: Tag[]): void => {
        this.ngRedux.dispatch({
            type: TagsActions.SET_TAGS,
            payload: { tags }
        });
    }

    setCurrentTag = (tag: Tag): void => {
        this.ngRedux.dispatch({
            type: TagsActions.SET_CURRENT_TAG,
            payload: { tag }
        });
    }

    resetCurrentTag = (): void => {
        this.ngRedux.dispatch({
            type: TagsActions.RESET_CURRENT_TAG,
        });
    }
}