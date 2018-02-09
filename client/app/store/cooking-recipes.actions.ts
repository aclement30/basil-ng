import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { AppState } from './index';
import { RecipeSummary } from '../models/recipe.model';

export interface ActionWithRecipe extends Action {
  recipes?: RecipeSummary[];
  recipe?: RecipeSummary;
  multiplier?: number;
}

class SetCookingRecipes implements ActionWithRecipe {
  readonly type = CookingRecipesActions.SET_COOKING_RECIPES;
  constructor(public recipes: RecipeSummary[]) {}
}

class StartCooking implements ActionWithRecipe {
  readonly type = CookingRecipesActions.START_COOKING;
  constructor(public recipe: RecipeSummary, public multiplier: number) {}
}

class StopCooking implements ActionWithRecipe {
  readonly type = CookingRecipesActions.STOP_COOKING;
  constructor(public recipe: RecipeSummary) {}
}

class UpdateServings implements ActionWithRecipe {
  readonly type = CookingRecipesActions.UPDATE_SERVINGS;
  constructor(public recipe: RecipeSummary, public multiplier: number) {}
}

class SetCurrentRecipe implements ActionWithRecipe {
  readonly type = CookingRecipesActions.SET_CURRENT_RECIPE;
  constructor(public recipe: RecipeSummary) {}
}

class ResetCurrentRecipe implements Action {
  readonly type = CookingRecipesActions.RESET_CURRENT_RECIPE;
}

@Injectable()
export class CookingRecipesActions {
  constructor (private store: Store<AppState>) {}

  static SET_COOKING_RECIPES = 'SET_COOKING_RECIPES';
  static START_COOKING = 'START_COOKING';
  static STOP_COOKING = 'STOP_COOKING';
  static UPDATE_SERVINGS = 'UPDATE_SERVINGS';
  static SET_CURRENT_RECIPE = 'SET_CURRENT_RECIPE';
  static RESET_CURRENT_RECIPE = 'RESET_CURRENT_RECIPE';

  setCookingRecipes = (recipes: RecipeSummary[]): void => {
    this.store.dispatch(new SetCookingRecipes(recipes));
  }

  startCooking = (recipe: RecipeSummary, multiplier: number): void => {
    this.store.dispatch(new StartCooking(recipe, multiplier));
  }

  stopCooking = (recipe: RecipeSummary): void => {
    this.store.dispatch(new StopCooking(recipe));
  }

  updateServings = (recipe: RecipeSummary, multiplier: number): void => {
    this.store.dispatch(new UpdateServings(recipe, multiplier));
  }

  setCurrentRecipe = (recipe: RecipeSummary): void => {
    this.store.dispatch(new SetCurrentRecipe(recipe));
  }

  resetCurrentRecipe = (): void => {
    this.store.dispatch(new ResetCurrentRecipe());
  }
}
