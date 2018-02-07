import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';

import { FoodItem } from '../core/interfaces';
import { Recipe, RecipeSummary, Ingredient } from './recipe.model';
import { RecipesActions } from '../core/redux.actions';
import { Observable } from 'rxjs/Observable';

export class RecipeImportResult {
    url: string;
    recipe?: Recipe;
    errorMessage?: string;
}

export const ignoredGroceryItems = [
    'sel',
    'sel et poivre',
    'poivre',
    'poivre du moulin',
    'poivre noir',
    'poivre noir du moulin',
    'huile d\'olive',
    'huile',
    'sucre',
    'farine',
    'eau',
];

@Injectable()
export class RecipeService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private apiUrl = 'api/recipes';

    constructor(
        private http: Http,
        private recipesActions: RecipesActions,
        private ngRedux: NgRedux<IAppState>) { }

    query(params: any): Observable<Recipe[]> {
        return this.http.get(this.apiUrl, params)
            .map(response => response.json().map((data: any) => new Recipe(data)));
    }

    get(id: string): Promise<Recipe> {
        return this.http.get(`${this.apiUrl}/${id}`)
            .toPromise()
            .then(response => new Recipe(response.json()))
    }

    delete(id: string): Promise<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
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
    }

    update(recipe: Recipe): Promise<Recipe> {
        const url = `${this.apiUrl}/${recipe._id}`;
        return this.http
            .put(url, JSON.stringify(recipe), { headers: this.headers })
            .toPromise()
            .then(() => recipe)
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

    getShoppingListFromIngredients(ingredients: Ingredient[], multiplier: number): FoodItem[] {
        const items: FoodItem[] = [];

        ingredients.forEach((ingredient) => {
            const item = new Ingredient(ingredient);

            // Remove quantity for mass/volume measured ingredients
            if (item.unitType.name !== 'ITEM') {
                item.quantity = null;
            } else {
                item.quantity = item.quantity * multiplier;
            }

            // Ignore basic ingredients such as water, salt, etc
            if (ignoredGroceryItems.indexOf(item.name) < 0) {
                items.push(item);
            }
        });

        return items;
    }
}
