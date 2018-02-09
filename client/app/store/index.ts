import { Action, ActionReducerMap } from '@ngrx/store';

import { tagsReducer, TagsState } from './tags.reducer';
import { uiReducer, UIState } from './ui.reducer';
import { cookingRecipesReducer, CookingRecipesState } from './cooking-recipes.reducer';
import { sessionReducer, SessionState } from './session.reducer';
import { timersReducer } from './timers.reducer';
import { Timer } from '../core/timer.model';

export interface ActionWithPayload extends Action {
  payload: any;
}

export interface AppState {
  cookingRecipes: CookingRecipesState;
  session: SessionState;
  tags: TagsState;
  timers: Timer[];
  ui: UIState;
}

export const reducers: ActionReducerMap<AppState> = {
  cookingRecipes: cookingRecipesReducer,
  session: sessionReducer,
  tags: tagsReducer,
  timers: timersReducer,
  ui: uiReducer,
};
