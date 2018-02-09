import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as ingredientParser from '../ingredient.grammar';
import { GroceryItem } from '../models/grocery-item.model';
import { FoodItem } from '../core/interfaces';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroceryService {

    private headers = {'Content-Type': 'application/json'};
    private apiUrl = 'api/groceries';

    constructor(private http: HttpClient) { }

    query(): Observable<GroceryItem[]> {
        return this.http.get(this.apiUrl)
            .map(response => (response as any).map((data: any) => new GroceryItem(data)));
    }

    remove(id: string): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers });
    }

    add(items: FoodItem[]): Observable<GroceryItem[]> {
        return this.http
            .post(this.apiUrl, JSON.stringify(items), { headers: this.headers })
            .map(response => (response as any).map((data: any) => new GroceryItem(data)));
    }

    parse(text: string): GroceryItem {
        let parsedIngredient: GroceryItem;

        try {
            parsedIngredient = new GroceryItem(ingredientParser.parse(text.trim()));
        } catch (error) {
            parsedIngredient = new GroceryItem({ name: text.trim() });
        }

        return parsedIngredient;
    }

    toggleItem(item: GroceryItem): Observable<any> {
        const url = `${this.apiUrl}/${item._id}/toggle`;
        return this.http
            .patch(url, { headers: this.headers })
            .map(response => {
                const updatedItem = new GroceryItem(response);
                item.isCrossed = updatedItem.isCrossed;
                return item;
            });
    }

    clearCrossedItems(): Observable<any> {
        const url = `${this.apiUrl}/clear`;
        return this.http.delete(url, { headers: this.headers });
    }

    update(item: GroceryItem): Observable<GroceryItem> {
        const url = `${this.apiUrl}/${item._id}`;
        return this.http
            .put(url, JSON.stringify(item), { headers: this.headers })
            .map(() => item);
    }
}
