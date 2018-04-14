import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Tag } from '../models/tag.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TagService {

  private apiUrl = 'api/tags';

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) { }

  query(): Observable<Tag[]> {
    const language = this.translate.currentLang;
    return this.http.get(this.apiUrl, { params: { lang: language } })
        .map(response => (response as any).map((data: any) => new Tag(data)));
  }
}
