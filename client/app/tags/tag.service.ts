import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Tag } from './tag.model';

@Injectable()
export class TagService {

    private apiUrl = 'api/tags';

    constructor(private http: Http) { }

    query(): Promise<Tag[]> {
        return this.http.get(this.apiUrl)
            .toPromise()
            .then(response => response.json().map((data: any) => new Tag(data)))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}