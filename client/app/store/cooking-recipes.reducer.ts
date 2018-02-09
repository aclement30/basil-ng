import * as moment from 'moment';

import { RecipeSummary } from '../models/recipe.model';
import { AppState } from './index';
import { ActionWithRecipe, CookingRecipesActions } from './cooking-recipes.actions';

export interface CookingRecipesState {
  list: RecipeSummary[];
  current: RecipeSummary;
}

export const INITIAL_STATE: CookingRecipesState = {
  list: [],
  current: null,
}

export function cookingRecipesReducer(state: CookingRecipesState = INITIAL_STATE, action: ActionWithRecipe): CookingRecipesState {
  switch (action.type) {
    case CookingRecipesActions.SET_COOKING_RECIPES:
      return {
        ...state,
        list: action.recipes.slice(),
      };

    case CookingRecipesActions.START_COOKING: {
      const INDEX = state.list.findIndex(recipe => (recipe._id === action.recipe._id));
      const updatedList = state.list.slice();

      if (INDEX < 0) {
        const recipeSummary = new RecipeSummary(Object.assign({}, action.recipe, {
          multiplier: action.multiplier,
          started: moment().toISOString(),
        }));

        updatedList.push(recipeSummary);
      }

      return {
        ...state,
        list: updatedList,
      };
    }

    case CookingRecipesActions.STOP_COOKING:
      return {
        ...state,
        list: state.list.filter(recipe => (recipe._id !== action.recipe._id))
      };

    case CookingRecipesActions.UPDATE_SERVINGS: {
      const INDEX = state.list.findIndex(recipe => (recipe._id === action.recipe._id));
      const updatedList = state.list.slice();
      updatedList[INDEX].multiplier = action.multiplier;

      return {
        ...state,
        list: updatedList,
      };
    }

    case CookingRecipesActions.SET_CURRENT_RECIPE:
      return {
        ...state,
        current: action.recipe,
      };

    case CookingRecipesActions.RESET_CURRENT_RECIPE:
      return {
        ...state,
        current: null,
      };

    default:
      return state;
  }
}

export const getCookingRecipes = (state: AppState) => (state.cookingRecipes.list);
export const getCurrentCookingRecipe = (state: AppState) => (state.cookingRecipes.current);
