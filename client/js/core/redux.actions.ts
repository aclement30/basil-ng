import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { Recipe, RecipeSummary } from '../recipes/recipe.model';
import User from './user.model';

@Injectable()
export class SessionActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SET_USER: string = 'SET_USER';
    static RESET_USER: string = 'RESET_USER';
    static START_LOADING: string = 'START_LOADING';
    static STOP_LOADING: string = 'STOP_LOADING';

    setUser = (user: User): void => {
        this.ngRedux.dispatch({
            type: SessionActions.SET_USER,
            payload: { user }
        });
    }

    resetUser = (): void => {
        this.ngRedux.dispatch({ type: SessionActions.RESET_USER });
    }

    startLoading = (): void => {
        this.ngRedux.dispatch({ type: SessionActions.START_LOADING });
    }

    stopLoading = (): void => {
        this.ngRedux.dispatch({ type: SessionActions.STOP_LOADING });
    }
}

@Injectable()
export class RecipesActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SET_COOKING_RECIPES: string = 'SET_COOKING_RECIPES';
    static START_COOKING: string = 'START_COOKING';
    static STOP_COOKING: string = 'STOP_COOKING';

    setCookingRecipes = (recipes: RecipeSummary[]): void => {
        this.ngRedux.dispatch({
            type: RecipesActions.SET_COOKING_RECIPES,
            payload: { recipes }
        });
    }

    startCooking = (recipe: Recipe): void => {
        this.ngRedux.dispatch({
            type: RecipesActions.START_COOKING,
            payload: { recipe }
        });

        this.ngRedux.dispatch({ type: UIActions.ENABLE_COOKMODE });
    }

    stopCooking = (recipe: Recipe): void => {
        this.ngRedux.dispatch({
            type: RecipesActions.STOP_COOKING,
            payload: { recipe }
        });
    }
}

@Injectable()
export class UIActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SHOW_KITCHEN_SIDEBAR: string = 'SHOW_KITCHEN_SIDEBAR';
    static HIDE_KITCHEN_SIDEBAR: string = 'HIDE_KITCHEN_SIDEBAR';
    static ENABLE_COOKMODE: string = 'ENABLE_COOKMODE';
    static DISABLE_COOKMODE: string = 'DISABLE_COOKMODE';

    showKitchenSidebar = (): void => {
        this.ngRedux.dispatch({ type: UIActions.SHOW_KITCHEN_SIDEBAR });
    }

    hideKitchenSidebar = (): void => {
        this.ngRedux.dispatch({ type: UIActions.HIDE_KITCHEN_SIDEBAR });
    }

    enableCookmode = (): void => {
        this.ngRedux.dispatch({ type: UIActions.ENABLE_COOKMODE });
    }

    disableCookmode = (): void => {
        this.ngRedux.dispatch({ type: UIActions.DISABLE_COOKMODE });
    }
}