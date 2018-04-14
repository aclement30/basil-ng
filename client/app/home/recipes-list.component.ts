import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { Tag } from '../models/tag.model';
import { User } from '../models/user.model';
import { getCurrentTag, getTags } from '../store/tags.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../store/index';
import { TagsActions } from '../store/tags.actions';
import { getCurrentUser } from '../store/session.reducer';

@Component({
    selector: 'recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['recipes-list.component.scss'],
})

export class RecipesListComponent implements OnInit, OnDestroy {

    private paramsSubscriber: Subscription;

    recipesLoaded = false;
    recipes: Recipe[] = [];
    _filteredRecipes: Recipe[] = [];
    selectedTag$: Observable<Tag>;
    tags$: Observable<Tag[]>;

    constructor(
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private tagsActions: TagsActions) { }

    ngOnInit(): void {
        this.selectedTag$ = this.store.select(getCurrentTag);
        this.tags$ = this.store.select(getTags);
        this.paramsSubscriber = this.route.params.subscribe(this.onParamsChange);
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    onParamsChange = (params) => {
        const userId = params.userId;
        if (!userId) {
          this.store.select(getCurrentUser)
            .filter(Boolean)
            .take(1)
            .subscribe((currentUser: User) => {
                this.router.navigate(['recipes', 'user', currentUser.id]);
            });
        } else {
          this.getRecipes(userId);
        }

        const alias = params.tag;
        if (alias) {
            this.store.select(getTags).take(1)
              .subscribe((tags: Tag[]) => {
                const currentTag = tags.find(listTag => listTag.alias === alias);

                if (currentTag) {
                    this.tagsActions.setCurrentTag(currentTag);
                    this.filterRecipes();
                } else {
                    this.tagsActions.resetCurrentTag();
                }
            });
        } else {
            this.tagsActions.resetCurrentTag();
        }
    }

    select(recipe: Recipe): void {
        this.router.navigate(['/recipes/detail', recipe._id]);
    }

    selectTag(tag: Tag): void {
        this.router.navigate(['tag', tag.alias], { relativeTo: this.route.parent });
    }

    filterRecipes() {
        this.selectedTag$.first().subscribe(tag => {
            if (tag) {
                this._filteredRecipes = this.recipes.filter(recipe => recipe.tags.find(tagId => tag._id === tagId));
            } else {
                this._filteredRecipes = this.recipes.slice();
            }
        });
    }

    get orderedRecipes(): Recipe[] {
        return this._filteredRecipes.sort((a, b) => {
            const textA = a.title.toUpperCase();
            const textB = b.title.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
    }

    private getRecipes(userId: string): void {
      this.recipeService.query({ userId })
          .subscribe((recipes: Recipe[]) => {
              this.recipes = recipes;
              this.recipesLoaded = true;
              this.filterRecipes();
          });
    }
}
