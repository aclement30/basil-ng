import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { Recipe, RecipeSummary, Ingredient } from './recipe.model';
import { RecipesActions } from '../core/redux.actions';

export class RecipeImportResult {
    url: string;
    recipe?: Recipe;
    errorMessage?: string;
}

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
        return this.http.delete(url, { headers: this.headers })
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
            .post(this.apiUrl, JSON.stringify(recipe), { headers: this.headers })
            .toPromise()
            .then(res => new Recipe(res.json()))
            .catch(this.handleError);
    }

    update(recipe: Recipe): Promise<Recipe> {
        const url = `${this.apiUrl}/${recipe._id}`;
        return this.http
            .put(url, JSON.stringify(recipe), { headers: this.headers })
            .toPromise()
            .then(() => recipe)
            .catch(this.handleError);
    }

    import(url: string): Promise<Recipe> {
        return this.http
            .post(`${this.apiUrl}/import`, JSON.stringify({ url }), { headers: this.headers })
            .toPromise()
            .then((response) => {
                const result: RecipeImportResult = response.json();

                return new Recipe(result.recipe);
            })
            .catch((response) => {
                const result: RecipeImportResult = response.json();

                return Promise.reject(result.errorMessage);
            });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}