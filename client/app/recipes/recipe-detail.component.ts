import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { CookingRecipeService } from '../services/cooking-recipe.service';
import { DialogService } from '../services/dialog.service';
import { GroceryService } from '../services/grocery.service';
import { NotificationService } from '../services/notification.service';
import { RecipeService } from '../services/recipe.service';
import { Recipe, RecipeSummary } from '../models/recipe.model';
import { Timer } from '../models/timer.model';
import { TimerService } from '../services/timer.service';
import { Tag } from '../models/tag.model';
import { AppState } from '../store/index';
import { getTimers } from '../store/timers.reducer';
import { getCookingRecipes } from '../store/cooking-recipes.reducer';
import { getTags } from '../store/tags.reducer';
import { CookingRecipesActions } from '../store/cooking-recipes.actions';

class ServingOption {
    label: string;
    multiplier: number;
}

@Component({
    selector: 'recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['recipe-detail.component.scss'],
})

export class RecipeDetailComponent implements OnInit {
    paramsSubscriber: any;
    recipe: Recipe;
    _serving: ServingOption;
    canSelectIngredients = false;
    selectedIngredients = {};
    tags: Tag[];

    private cookingRecipes$: Observable<RecipeSummary[]>;
    private timers$: Observable<Timer[]>;
    private tags$: Observable<Tag[]>;

    constructor(
        private cookingRecipeService: CookingRecipeService,
        private dialogService: DialogService,
        private groceryService: GroceryService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private recipesActions: CookingRecipesActions,
        private recipeService: RecipeService,
        private store: Store<AppState>,
        private timerService: TimerService,
        private translate: TranslateService,
    ) {}

    ngOnInit(): void {
        this.cookingRecipes$ = this.store.select(getCookingRecipes);
        this.timers$ = this.store.select(getTimers);
        this.tags$ = this.store.select(getTags);

      this.paramsSubscriber = this.route.params.subscribe(params => {
            const id = params['id'];

            this.recipeService.get(id)
              .combineLatest(
                this.tags$,
                (recipe: Recipe, tags: Tag[]) => ({ recipe, tags }),
              )
              .subscribe((data) => {
                this.recipe = data.recipe;
                this.selectedIngredients = {};
                this.tags = data.recipe.tags.map(tagId => data.tags.find(tag => tag._id === tagId));

                this.recipesActions.setCurrentRecipe(data.recipe);
              });
        });
    }

    startCooking() {
        this.serving$.first().subscribe((serving: ServingOption) => {
            this.cookingRecipeService.startCooking(this.recipe, serving.multiplier).subscribe();
        });
    }

    stopCooking() {
        this.activeTimers$.first().subscribe((activeTimers: Timer[]) => {
            if (activeTimers.length) {
                const message = activeTimers.length > 1 ? this.translate.instant('recipeDetail.manyExistingTimers', { count: activeTimers.length }) : this.translate.instant('recipeDetail.oneExistingTimer');
                this.dialogService.confirm(message)
                    .then(() => {
                        activeTimers.forEach(timer => {
                            this.timerService.remove(timer);
                        });
                    }, () => {
                    });
            }
        });

        this.cookingRecipeService.stopCooking(this.recipe).subscribe();
    }

    changeServing(serving: ServingOption) {
        this._serving = serving;

        this.isCooking$.first().subscribe(isCooking => {
            if (isCooking) {
                this.cookingRecipeService.updateServings(this.recipe, serving.multiplier).subscribe();
            }
        });
    }

    addIngredientsToShoppingList() {
        this.serving$.first().subscribe((serving: ServingOption) => {
            const items = this.recipeService.getShoppingListFromIngredients(this.recipe.ingredients, serving.multiplier);

            this.groceryService.add(items)
                .subscribe(() => {
                    this.notificationService.notify(this.translate.instant('recipeDetail.ingredientsAddedShoppingList'));
                });
        });

    }

    getServingOptionForServing(serving: number): ServingOption {
        let label = `${serving} portion`;
        if (serving > 1) { label += 's'; }

        return { label, multiplier: (serving / this.recipe.recipeYield) };
    }

    getServingOptionForYield(recipeYield: number): ServingOption {
        return { label: `${recipeYield} x`, multiplier: recipeYield };
    }

    get servingOptions(): ServingOption[] {
        const options = [];

        if (this.recipe.recipeYield) {
            for (let i = 1; i <= (this.recipe.recipeYield * 2); i++) {
                options.push(this.getServingOptionForServing(i));
            }
        } else {
            for (let i = 1; i <= 4; i++) {
                options.push(this.getServingOptionForYield(i));
            }
        }

        return options;
    }

    get activeTimers$(): Observable<Timer[]> {
        return this.timers$.map((timers: Timer[]) => {
            return timers.filter(timer => (timer.recipeId === this.recipe._id && !timer.completed));
        });
    }

    get serving$(): Observable<ServingOption> {
        return this.cookingRecipes$.map((cookingRecipes: RecipeSummary[]) => {
            const cookingRecipe = cookingRecipes.find(recipe => (recipe._id === this.recipe._id));

            let multiplier: number;

            if (cookingRecipe) {
                multiplier = cookingRecipe.multiplier;
            } else if (this._serving) {
                multiplier = this._serving.multiplier;
            } else {
                multiplier = 1;
            }

            return this.servingOptions.find(option => (option.multiplier === multiplier));
        });
    }

    get isCooking$(): Observable<boolean> {
        return this.cookingRecipes$.map((cookingRecipes: RecipeSummary[]) => {
            return cookingRecipes.some(recipe => (recipe._id === this.recipe._id));
        });
    }
}

@Injectable()
export class CanDeactivateRecipeDetail implements CanDeactivate<RecipeDetailComponent> {
    constructor(private recipesActions: CookingRecipesActions) {}

    canDeactivate(
        component: RecipeDetailComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        this.recipesActions.resetCurrentRecipe();
        return true;
    }
}
