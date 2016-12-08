import { ICookingRecipes } from '../redux';
import { RecipesActions } from '../core/redux.actions';

import { RecipeSummary } from './recipe.model';

export const INITIAL_STATE: ICookingRecipes = {
    list: [],
}

export function cookingRecipesReducer(state: ICookingRecipes = INITIAL_STATE, action: any): ICookingRecipes {
    if (!action.type) {
        return state;
    }

    let newState = Object.assign({}, state);

    switch (action.type) {
        case RecipesActions.SET_COOKING_RECIPES:
            newState.list = action.payload.recipes.slice();

            return newState;

        case RecipesActions.START_COOKING: {
            const INDEX = state.list.findIndex(recipe => (recipe._id === action.payload.recipe._id));

            if (INDEX < 0) {
                newState.list.push(action.payload.recipe as RecipeSummary);
            }

            return newState;
        }

        case RecipesActions.STOP_COOKING: {
            const INDEX = state.list.findIndex(recipe => (recipe._id === action.payload.recipe._id));
            if (INDEX >= 0) {
                newState.list.splice(INDEX, 1);
            }

            return newState;
        }

        default:
            return state;
    }
}
