import { Injectable  } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Tag } from './tag.model';
import { TagService } from './tag.service';
import { TagsActions } from '../store/tags.actions';

@Injectable()
export class TagsResolver implements Resolve<Tag[]> {

    constructor(private tagService: TagService, private tagsActions: TagsActions) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.tagService.query()
            .do(tags => {
                this.tagsActions.setTags(tags);
                return tags;
            });
    }
}
