import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { Recipe, RecipeSummary } from '../recipes/recipe.model';
import { Timer } from './timer.model';
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
    static SET_CURRENT_RECIPE: string = 'SET_CURRENT_RECIPE';
    static RESET_CURRENT_RECIPE: string = 'RESET_CURRENT_RECIPE';

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

        let state = this.ngRedux.getState();
        if (state.ui.cookmode && !state.cookingRecipes.list.length) {
            this.ngRedux.dispatch({ type: UIActions.DISABLE_COOKMODE });
        }
    }

    setCurrentRecipe = (recipe: Recipe): void => {
        this.ngRedux.dispatch({
            type: RecipesActions.SET_CURRENT_RECIPE,
            payload: { recipe }
        });
    }

    resetCurrentRecipe = (): void => {
        this.ngRedux.dispatch({ type: RecipesActions.RESET_CURRENT_RECIPE });
    }
}

@Injectable()
export class TimersActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SET_TIMERS: string = 'SET_TIMERS';
    static ADD_TIMER: string = 'ADD_TIMER';
    static START_TIMER: string = 'START_TIMER';
    static UPDATE_TIMER: string = 'UPDATE_TIMER';
    static COMPLETE_TIMER: string = 'COMPLETE_TIMER';
    static REMOVE_TIMER: string = 'REMOVE_TIMER';

    setTimers = (timers: Timer[]): void => {
        this.ngRedux.dispatch({
            type: TimersActions.SET_TIMERS,
            payload: { timers }
        });
    }

    addTimer = (timer: Timer): void => {
        this.ngRedux.dispatch({
            type: TimersActions.ADD_TIMER,
            payload: { timer }
        });
    }

    startTimer = (timer: Timer): void => {
        this.ngRedux.dispatch({
            type: TimersActions.START_TIMER,
            payload: { timer }
        });
    }

    updateTimer = (timer: Timer): void => {
        this.ngRedux.dispatch({
            type: TimersActions.UPDATE_TIMER,
            payload: { timer }
        });
    }

    completeTimer = (timer: Timer): void => {
        this.ngRedux.dispatch({
            type: TimersActions.COMPLETE_TIMER,
            payload: { timer }
        });
    }

    removeTimer = (timer: Timer): void => {
        this.ngRedux.dispatch({
            type: TimersActions.REMOVE_TIMER,
            payload: { timer }
        });
    }
}

@Injectable()
export class UIActions {
    constructor (private ngRedux: NgRedux<IAppState>) {}

    static SHOW_KITCHEN_SIDEBAR: string = 'SHOW_KITCHEN_SIDEBAR';
    static HIDE_KITCHEN_SIDEBAR: string = 'HIDE_KITCHEN_SIDEBAR';
    static SHOW_SIDEBAR: string = 'SHOW_SIDEBAR';
    static HIDE_SIDEBAR: string = 'HIDE_SIDEBAR';
    static ENABLE_COOKMODE: string = 'ENABLE_COOKMODE';
    static DISABLE_COOKMODE: string = 'DISABLE_COOKMODE';
    static ENABLE_VOICE_ASSISTANT: string = 'ENABLE_VOICE_ASSISTANT';
    static DISABLE_VOICE_ASSISTANT: string = 'DISABLE_VOICE_ASSISTANT';
    static START_LISTENING: string = 'START_LISTENING';
    static STOP_LISTENING: string = 'STOP_LISTENING';

    showKitchenSidebar = (): void => {
    this.ngRedux.dispatch({ type: UIActions.SHOW_KITCHEN_SIDEBAR });
}

    hideKitchenSidebar = (): void => {
        this.ngRedux.dispatch({ type: UIActions.HIDE_KITCHEN_SIDEBAR });
    }

    showSidebar = (): void => {
        this.ngRedux.dispatch({ type: UIActions.SHOW_SIDEBAR });
    }

    hideSidebar = (): void => {
        this.ngRedux.dispatch({ type: UIActions.HIDE_SIDEBAR });
    }

    enableCookmode = (): void => {
        this.ngRedux.dispatch({ type: UIActions.ENABLE_COOKMODE });
    }

    disableCookmode = (): void => {
        this.ngRedux.dispatch({ type: UIActions.DISABLE_COOKMODE });
    }

    enableVoiceAssistant = (): void => {
        this.ngRedux.dispatch({ type: UIActions.ENABLE_VOICE_ASSISTANT });
    }

    disableVoiceAssistant = (): void => {
        this.ngRedux.dispatch({ type: UIActions.DISABLE_VOICE_ASSISTANT });
    }

    startListening = (): void => {
        this.ngRedux.dispatch({ type: UIActions.START_LISTENING });
    }

    stopListening = (): void => {
        this.ngRedux.dispatch({ type: UIActions.STOP_LISTENING });
    }
}