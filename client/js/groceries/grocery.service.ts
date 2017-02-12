import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../redux';
const ingredientParser = require('../ingredient.grammar.peg');

import { GroceryItem } from './grocery-item.model';
import { FoodItem } from '../core/interfaces';

@Injectable()
export class GroceryService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private apiUrl = 'api/groceries';

    constructor(
        private http: Http,
        private ngRedux: NgRedux<IAppState>) { }

    query(): Promise<GroceryItem[]> {
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(response => response.json().map((data: any) => new GroceryItem(data)))
            .catch(this.handleError);
    }

    remove(id: string): Promise<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    add(items: FoodItem[]): Promise<GroceryItem[]> {
        return this.http
            .post(this.apiUrl, JSON.stringify(items), { headers: this.headers })
            .toPromise()
            .then(response => response.json().map((data: any) => new GroceryItem(data)))
            .catch(this.handleError);
    }

    parse(text: string): GroceryItem {
        let parsedIngredient: GroceryItem;

        try {
            parsedIngredient = new GroceryItem(ingredientParser.parse(text.trim()));
        } catch(error) {
            parsedIngredient = new GroceryItem({ name: text.trim() });
        }

        return parsedIngredient;
    }

    toggleItem(item: GroceryItem): Promise<any> {
        const url = `${this.apiUrl}/${item._id}/toggle`;
        return this.http
            .patch(url, { headers: this.headers })
            .toPromise()
            .then(response => {
                const updatedItem = new GroceryItem(response.json());

                item.isCrossed = updatedItem.isCrossed;

                return item;
            })
            .catch(this.handleError);
    }

    clearCrossedItems(): Promise<void> {
        const url = `${this.apiUrl}/clear`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    update(item: GroceryItem): Promise<GroceryItem> {
        const url = `${this.apiUrl}/${item._id}`;
        return this.http
            .put(url, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(() => item)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}