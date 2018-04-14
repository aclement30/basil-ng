import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Tag } from '../../models/tag.model';
import { AppState } from '../../store/index';
import { getCurrentTag, getTags } from '../../store/tags.reducer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'recipes-sidebar',
  template: `
    <aside class="sidebar">
      <ul class="main-menu">
        <li>
          <a [routerLink]="['/recipes']" [ngClass]="{'active': !(selectedTag$ | async)}">{{ 'home.allRecipes' | translate }}</a>
        </li>
        <li *ngFor="let tag of (tags$ | async)">
          <a (click)="selectTag(tag)" [ngClass]="{'active': (selectedTag$ | async) === tag}">{{ tag.name }}</a>
        </li>
      </ul>
    </aside>
  `,
  styleUrls: ['recipes-sidebar.component.scss'],
})

export class RecipesSidebarComponent implements OnInit {

  tags$: Observable<Tag[]>;
  selectedTag$: Observable<Tag>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.tags$ = this.store.select(getTags);
    this.selectedTag$ = this.store.select(getCurrentTag);
  }

  selectTag(tag: Tag): void {
    this.router.navigate(['tag', tag.alias], { relativeTo: this.route.parent });
  }
}
