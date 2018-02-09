import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { FoodItem } from '../core/interfaces';
import { Recipe, Ingredient } from '../models/recipe.model';

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

    private headers = {'Content-Type': 'application/json'};
    private apiUrl = 'api/recipes';

    constructor(private http: HttpClient) {}

    query(params: any): Observable<Recipe[]> {
        return this.http.get(this.apiUrl, params)
            .map(response => (response as any).map((data: any) => new Recipe(data)));
    }

    get(id: string): Observable<Recipe> {
        return this.http.get(`${this.apiUrl}/${id}`)
            .map(response => new Recipe(response));
    }

    delete(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers });
    }

    save(recipe: Recipe): Observable<Recipe> {
        if (recipe._id) {
            return this.update(recipe);
        }

        return this.create(recipe);
    }

    create(recipe: Recipe): Observable<Recipe> {
        return this.http
            .post(this.apiUrl, JSON.stringify(recipe), { headers: this.headers })
            .map(response => new Recipe(response));
    }

    update(recipe: Recipe): Observable<Recipe> {
        const url = `${this.apiUrl}/${recipe._id}`;
        return this.http
            .put(url, JSON.stringify(recipe), { headers: this.headers })
            .map(() => recipe);
    }

    import(url: string): Observable<Recipe> {
        return this.http
            .post<RecipeImportResult>(`${this.apiUrl}/import`, JSON.stringify({ url }), { headers: this.headers })
            .map((response: RecipeImportResult) => {
                return new Recipe(response.recipe);
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
