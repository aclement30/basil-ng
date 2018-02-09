import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Recipe, RecipeSummary } from './recipe.model';
import { CookingRecipesActions } from '../store/cooking-recipes.actions';

@Injectable()
export class CookingRecipeService {

    private queryOptions = { headers: { 'Content-Type': 'application/json' }, responseType: 'text' as 'text' };
    private apiUrl = 'api/cookingRecipes';

    constructor(
        private http: HttpClient,
        private recipesActions: CookingRecipesActions,
    ) { }

    query(): Observable<RecipeSummary[]> {
        return this.http.get<RecipeSummary[]>(this.apiUrl)
            .do((cookingRecipes: RecipeSummary[]) => {
                this.recipesActions.setCookingRecipes(cookingRecipes);
                return cookingRecipes;
            });
    }

    startCooking(recipe: Recipe, multiplier: number): Observable<any> {
        const url = `${this.apiUrl}/${recipe._id}/startCooking`;
        return this.http
            .patch(url, { multiplier }, this.queryOptions)
            .do(() => {
                this.recipesActions.startCooking(recipe, multiplier);
            });
    }

    stopCooking(recipe: Recipe): Observable<any> {
        const url = `${this.apiUrl}/${recipe._id}/stopCooking`;
        return this.http
            .patch(url, null, this.queryOptions)
            .do(() => {
                this.recipesActions.stopCooking(recipe);
            });
    }

    updateServings(recipe: Recipe, multiplier: number): Observable<any> {
        const url = `${this.apiUrl}/${recipe._id}/servings`;
        return this.http
            .patch(url, { multiplier }, this.queryOptions)
            .do(() => {
                this.recipesActions.updateServings(recipe, multiplier);
            });
    }
}
