import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Tag } from '../tags/tag.model';
import { AppState } from '../store/index';
import { getCurrentTag, getTags } from '../store/tags.reducer';

@Component({
    selector: 'recipes-sidebar',
    template: `
        <aside class="sidebar">
            <ul class="main-menu">
                <li>
                    <a [routerLink]="['/recipes']" [ngClass]="{'active': !(selectedTag$ | async)}">Toutes les recettes</a>
                </li>
                <li *ngFor="let tag of (tags$ | async).list">
                    <a [routerLink]="['tag', tag.alias]" [ngClass]="{'active': (selectedTag$ | async) === tag}">{{ tag.name }}</a>
                </li>
            </ul>
        </aside>
    `
})

export class RecipesSidebarComponent implements OnInit {

    tags$: Observable<Tag[]>;
    selectedTag$: Observable<Tag>;

    constructor(
        private store: Store<AppState>
    ) {}

    ngOnInit() {
      this.tags$ = this.store.select(getTags);
      this.selectedTag$ = this.store.select(getCurrentTag);
    }
}
