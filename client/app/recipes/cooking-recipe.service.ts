import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { Recipe, RecipeSummary, Ingredient } from './recipe.model';
import { RecipesActions } from '../core/redux.actions';

@Injectable()
export class CookingRecipeService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private apiUrl = 'api/cookingRecipes';

    constructor(
        private http: Http,
        private recipesActions: RecipesActions,
        private ngRedux: NgRedux<IAppState>) { }

    query(): Promise<RecipeSummary[]> {
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(response => {
                const cookingRecipes = response.json();
                this.recipesActions.setCookingRecipes(cookingRecipes);
                return cookingRecipes;
            })
            .catch(this.handleError);
    }

    startCooking(recipe: Recipe, multiplier: number): Promise<any> {
        const url = `${this.apiUrl}/${recipe._id}/startCooking`;
        return this.http
            .patch(url, { headers: this.headers, multiplier })
            .toPromise()
            .then(() => {
                this.recipesActions.startCooking(recipe, multiplier);
            })
            .catch(this.handleError);
    }

    stopCooking(recipe: Recipe): Promise<any> {
        const url = `${this.apiUrl}/${recipe._id}/stopCooking`;
        return this.http
            .patch(url, { headers: this.headers })
            .toPromise()
            .then(() => {
                this.recipesActions.stopCooking(recipe);
            })
            .catch(this.handleError);
    }

    updateServings(recipe: Recipe, multiplier: number): Promise<any> {
        const url = `${this.apiUrl}/${recipe._id}/servings`;
        return this.http
            .patch(url, { headers: this.headers, multiplier })
            .toPromise()
            .then(() => {
                this.recipesActions.updateServings(recipe, multiplier);
            })
            .catch(this.handleError);
    }

    findCookingRecipe(id: string): RecipeSummary {
        return this.ngRedux.getState().cookingRecipes.list.find(recipe => (recipe._id === id));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}