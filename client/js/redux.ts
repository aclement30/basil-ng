import { combineReducers } from 'redux';

// Reducers
import { cookingRecipesReducer } from './recipes/recipes.reducer';
import { sessionReducer } from './core/session.reducer';
import { timersReducer } from './core/timers.reducer';
import { uiReducer } from './core/ui.reducer';

import { Timer } from './core/timer.model';
import User from './core/user.model';
import { Recipe, RecipeSummary } from "./recipes/recipe.model";

export interface ISession {
    user?: User;
    loading: boolean;
}

export interface IKitchenSidebar {
    displayed: boolean;
}

export interface ISidebar {
    displayed: boolean;
}

export interface IVoiceAssistant {
    enabled: boolean;
    listening: boolean;
}

export interface IUI {
    cookmode: boolean;
    kitchenSidebar: IKitchenSidebar;
    sidebar: ISidebar;
    voiceAssistant: IVoiceAssistant;
}

export interface ICookingRecipes {
    list: RecipeSummary[];
    current: Recipe;
}

export interface IAppState {
    cookingRecipes: ICookingRecipes;
    session: ISession;
    timers: Timer[];
    ui: IUI;
};

export const rootReducer = combineReducers<IAppState>({
    cookingRecipes: cookingRecipesReducer,
    session: sessionReducer,
    timers: timersReducer,
    ui: uiReducer,
});