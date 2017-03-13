import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { Tag } from "../tags/tag.model";
import { TagsActions } from "../tags/tags.actions";
import { ITags } from "../redux";

@Component({
    selector: 'recipes-sidebar',
    template: `
        <aside class="sidebar">
            <ul class="main-menu">
                <li>
                    <a [routerLink]="['/recipes']" [ngClass]="{'active': !(selectedTag | async)}">Toutes les recettes</a>
                </li>
                <li *ngFor="let tag of (tags$ | async).list">
                    <a [routerLink]="['tag', tag.alias]" [ngClass]="{'active': (selectedTag | async) === tag}">{{ tag.name }}</a>
                </li>
            </ul>
        </aside>
    `
})

export class RecipesSidebarComponent {

    @select('tags') tags$: Observable<ITags>;

    constructor(
        private tagsActions: TagsActions,
    ) {}

    get selectedTag(): Observable<Tag> {
        return this.tags$.map((tags: ITags) => {
            return tags.current;
        });
    }
}