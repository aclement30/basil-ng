import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { select } from 'ng2-redux';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { TagsActions } from "../tags/tags.actions";
import {ITags} from "../redux";
import {Tag} from "../tags/tag.model";
import User from '../core/user.model';
import { SecurityService } from '../core/security.service';

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

    @select('tags') tags$: Observable<ITags>;

    constructor(
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        private router: Router,
        private securityService: SecurityService,
        private tagsActions: TagsActions) { }

    ngOnInit(): void {
        this.paramsSubscriber = this.route.params.subscribe(this.onParamsChange);
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    onParamsChange = (params) => {
        const userId = params.userId;
        if (!userId) {
          this.securityService.user$
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
            this.tags$.first().subscribe(tags => {
                const currentTag = tags.list.find(listTag => listTag.alias === alias);

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

    get selectedTag$(): Observable<Tag> {
        return this.tags$.map((tags: ITags) => {
            return tags.current;
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
