import { Injectable  } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Tag } from '../tags/tag.model';
import { TagService } from "../tags/tag.service";
import { TagsActions } from "../tags/tags.actions";

@Injectable()
export class TagsResolver implements Resolve<Tag[]> {

    constructor(private tagService: TagService, private tagsActions: TagsActions) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any>|Promise<any>|any {
        return this.tagService.query()
            .subscribe(tags => {
                this.tagsActions.setTags(tags);

                return tags;
            });
    }
}
