import { combineReducers } from 'redux';

// Reducers
import { cookingRecipesReducer } from './recipes/recipes.reducer';
import { sessionReducer } from './core/session.reducer';
import { tagsReducer } from './tags/tags.reducer';
import { timersReducer } from './core/timers.reducer';
import { uiReducer } from './core/ui.reducer';

import { Tag } from './tags/tag.model';
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

export interface INavigationMenu {
    displayed: boolean;
}

export interface IVoiceAssistant {
    enabled: boolean;
    listening: boolean;
}

export interface IUI {
    cookmode: boolean;
    kitchenSidebar: IKitchenSidebar;
    navigationMenu: INavigationMenu;
    voiceAssistant: IVoiceAssistant;
}

export interface ICookingRecipes {
    list: RecipeSummary[];
    current: Recipe;
}

export interface ITags {
    list: Tag[];
    current: Tag;
}

export interface IAppState {
    cookingRecipes: ICookingRecipes;
    session: ISession;
    tags: ITags;
    timers: Timer[];
    ui: IUI;
};

export const rootReducer = combineReducers<IAppState>({
    cookingRecipes: cookingRecipesReducer,
    session: sessionReducer,
    tags: tagsReducer,
    timers: timersReducer,
    ui: uiReducer,
});