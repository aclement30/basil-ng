import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Tag } from './tag.model';

@Injectable()
export class TagService {

    private apiUrl = 'api/tags';

    constructor(private http: HttpClient) { }

    query(): Observable<Tag[]> {
        return this.http.get(this.apiUrl)
            .map(response => (response as any).map((data: any) => new Tag(data)));
    }
}
