import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { Recipe, RecipeSummary } from './recipe.model';
import { RecipesActions } from '../core/redux.actions';

@Injectable()
export class RecipeService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private apiUrl = 'api/recipes';

    constructor(
        private http: Http,
        private recipesActions: RecipesActions,
        private ngRedux: NgRedux<IAppState>) { }

    query(): Promise<Recipe[]> {
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(response => response.json().map((data: any) => new Recipe(data)))
            .catch(this.handleError);
    }

    get(id: string): Promise<Recipe> {
        return this.http.get(`${this.apiUrl}/${id}`)
            .toPromise()
            .then(response => new Recipe(response.json()))
            .catch(this.handleError);
    }

    delete(id: string): Promise<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    save(recipe: Recipe): Promise<Recipe> {
        if (recipe._id) {
            return this.update(recipe);
        }

        return this.create(recipe);
    }

    create(recipe: Recipe): Promise<Recipe> {
        return this.http
            .post(this.apiUrl, JSON.stringify(recipe), {headers: this.headers})
            .toPromise()
            .then(res => new Recipe(res.json()))
            .catch(this.handleError);
    }

    update(recipe: Recipe): Promise<Recipe> {
        const url = `${this.apiUrl}/${recipe._id}`;
        return this.http
            .put(url, JSON.stringify(recipe), {headers: this.headers})
            .toPromise()
            .then(() => recipe)
            .catch(this.handleError);
    }

    // COOKING RECIPES

    queryCookingRecipes(): Promise<RecipeSummary[]> {
        return this.http.get('api/cookingRecipes')
            .toPromise()
            .then(response => {
                const cookingRecipes = response.json();
                this.recipesActions.setCookingRecipes(cookingRecipes);
                return cookingRecipes;
            })
            .catch(this.handleError);
    }

    startCooking(recipe: Recipe): Promise<any> {
        const url = `${this.apiUrl}/${recipe._id}/startCooking`;
        return this.http
            .patch(url, {headers: this.headers})
            .toPromise()
            .then(() => {
                this.recipesActions.startCooking(recipe);
            })
            .catch(this.handleError);
    }

    stopCooking(recipe: Recipe): Promise<any> {
        const url = `${this.apiUrl}/${recipe._id}/stopCooking`;
        return this.http
            .patch(url, {headers: this.headers})
            .toPromise()
            .then(() => {
                this.recipesActions.stopCooking(recipe);
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