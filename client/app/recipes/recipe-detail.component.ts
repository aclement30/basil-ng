import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { CookingRecipeService } from './cooking-recipe.service';
import { DialogService } from '../core/dialog.service';
import { GroceryService } from '../groceries/grocery.service';
import {ICookingRecipes, ITags} from '../redux';
import { NotificationService } from '../core/notification.service';
import { RecipesActions } from '../core/redux.actions';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';
import { Timer } from '../core/timer.model';
import { TimerService } from '../core/timer.service';
import {Tag} from "../tags/tag.model";

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
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    @select('timers') timers$: Observable<Timer[]>;
    @select('tags') tags$: Observable<ITags>;

    paramsSubscriber: any;
    recipe: Recipe;
    _serving: ServingOption;
    canSelectIngredients = false;
    selectedIngredients = {};
    tags: Tag[];

    constructor(
        private cookingRecipeService: CookingRecipeService,
        private dialogService: DialogService,
        private groceryService: GroceryService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private recipesActions: RecipesActions,
        private recipeService: RecipeService,
        private timerService: TimerService) {}

    ngOnInit(): void {
        this.paramsSubscriber = this.route.params.subscribe(params => {
            const id = params['id'];

            this.recipeService.get(id).then((recipe) => {
                this.recipe = recipe;
                this.selectedIngredients = {};

                this.tags$.first().subscribe((tags: ITags) => {
                    this.tags = recipe.tags.map(tagId => tags.list.find(tag => tag._id === tagId));
                }).unsubscribe();

                this.recipesActions.setCurrentRecipe(recipe);
            });
        });
    }

    startCooking() {
        this.serving$.first().subscribe((serving: ServingOption) => {
            this.cookingRecipeService.startCooking(this.recipe, serving.multiplier);
        });
    }

    stopCooking() {
        this.activeTimers$.first().subscribe((activeTimers: Timer[]) => {
            if (activeTimers.length) {
                const message = activeTimers.length > 1 ? `Il y a ${activeTimers.length} minuteries en cours pour cette recette. Voulez-vous les arrêter maintenant ?` : 'Il y a 1 minuterie en cours pour cette recette. Voulez-vous l\'arrêter maintenant ?';
                this.dialogService.confirm(message)
                    .then(() => {
                        activeTimers.forEach(timer => {
                            this.timerService.remove(timer);
                        })
                    }, () => {
                    })
            }
        });

        this.cookingRecipeService.stopCooking(this.recipe);
    }

    changeServing(serving: ServingOption) {
        this._serving = serving;

        this.isCooking$.first().subscribe(isCooking => {
            if (isCooking) {
                this.cookingRecipeService.updateServings(this.recipe, serving.multiplier);
            }
        });
    }

    addIngredientsToShoppingList() {
        this.serving$.first().subscribe((serving: ServingOption) => {
            const items = this.recipeService.getShoppingListFromIngredients(this.recipe.ingredients, serving.multiplier);

            this.groceryService.add(items)
                .then(() => {
                    this.notificationService.notify('Les ingrédients ont été ajoutés à la liste de course.');
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
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            const cookingRecipe = cookingRecipes.list.find(recipe => (recipe._id === this.recipe._id));

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
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.list.some(recipe => (recipe._id === this.recipe._id));
        });
    }
}

@Injectable()
export class CanDeactivateRecipeDetail implements CanDeactivate<RecipeDetailComponent> {
    constructor(private recipesActions: RecipesActions) {}

    canDeactivate(
        component: RecipeDetailComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        this.recipesActions.resetCurrentRecipe();
        return true;
    }
}
