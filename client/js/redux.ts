import { combineReducers } from 'redux';
const persistState = require('redux-localstorage');

// Reducers
import { cookingRecipesReducer } from './recipes/recipes.reducer';
import { sessionReducer } from './core/session.reducer';
import { uiReducer } from './core/ui.reducer';

import User from './core/user.model';
import { RecipeSummary } from "./recipes/recipe.model";

export interface ISession {
    user?: User;
    loading: boolean;
}

export interface IKitchenSidebar {
    displayed: boolean;

}
export interface IUI {
    cookmode: boolean;
    kitchenSidebar: IKitchenSidebar;
}

export interface ICookingRecipes {
    list: RecipeSummary[];
}

export interface IAppState {
    cookingRecipes: ICookingRecipes;
    session: ISession;
    ui: IUI;
};

export const rootReducer = combineReducers<IAppState>({
    cookingRecipes: cookingRecipesReducer,
    session: sessionReducer,
    ui: uiReducer,
});

export const enhancers = [
    persistState('session', { key: 'basil.session' })
];
