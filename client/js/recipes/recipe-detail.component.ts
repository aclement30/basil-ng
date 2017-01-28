import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { DialogService } from '../core/dialog.service';
import { ICookingRecipes } from '../redux';
import { RecipesActions } from '../core/redux.actions';
import { RecipeService } from './recipe.service';
import { Ingredient, Recipe } from './recipe.model';
import { Timer } from '../core/timer.model';
import { TimerService } from '../core/timer.service';

class ServingOption {
    label: string;
    multiplier: number;
}

@Component({
    selector: 'recipe-detail',
    template: `
        <div class="c-header" *ngIf="recipe">
            <h2>{{ recipe.title }}</h2>
            
            <ul class="actions a-alt">
                <li>
                    <a [routerLink]="['/recipes/edit', recipe._id]" class="btn btn-icon btn-link"><i class="zmdi zmdi-edit"></i></a>
                </li>
            </ul>
        </div>

        <div class="card" *ngIf="recipe">
            <div class="left">
                <div class="recipe-picture" [style.background-image]="recipe.image ? 'url(' + recipe.image + ')' : null">
                    <div class="cooking-recipe" *ngIf="isCooking$ | async">
                        <i class="zmdi zmdi-fire"></i> <span class="hidden-xs">Recette </span>en cours
                    </div>
                    <button (click)="stopCooking()" class="stop-cooking" *ngIf="isCooking$ | async">
                        <i class="zmdi zmdi-assignment-check"></i> Terminer<span class="hidden-xs"> la recette</span>
                    </button>
                </div>
                
                <button (click)="startCooking()" *ngIf="!(isCooking$ | async)" class="btn start-cooking btn-float btn-primary btn-icon waves-effect waves-circle waves-float"><i class="zmdi zmdi-cutlery"></i></button>

                <div class="pmo-block">
                    <h2 ngbDropdown>
                        <span>Ingrédients</span>
                        <button class="btn btn-default multiplier" ngbDropdownToggle>{{ serving.label }}</button>
                        
                        <ul class="dropdown-menu pull-right dm-icon">
                            <li class="dropdown-item" *ngFor="let option of servingOptions">
                                <a (click)="serving=option" [ngClass]="{selected: serving.multiplier === option.multiplier}">{{ option.label }}</a>
                            </li>
                        </ul>
                    </h2>

                    <ul class="ingredients">
                        <li *ngFor="let ingredient of recipe.ingredients">
                            <div *ngIf="ingredient.quantity" class="quantity">
                                {{ ingredient.multiply(serving.multiplier) }}
                                <small class="unit" *ngIf="ingredient.unit">{{ ingredient.unit | ingredientUnit }}</small>
                            </div>
                            
                            <div class="ingredient-name" *ngIf="ingredient.name">
                                {{ ingredient.name | capitalize }}
                                <span class="ingredient-type" *ngIf="ingredient.type">{{ ingredient.type }}</span>
                            </div>
                            <span *ngIf="!ingredient.name">{{ ingredient.description }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pm-body clearfix">
                <div class="pmb-block">
                    <div class="pmbb-header">
                        <h2>Préparation</h2>
                    </div>
                    
                    <div class="pmbb-body">
                        <div class="pmbb-view">
                            <ol class="instructions">
                                <li *ngFor="let step of recipe.recipeInstructions; let i = index">
                                    <button class="step"><span>{{ (i + 1) }}</span><i class="zmdi zmdi-hourglass-alt"></i></button>                                    
                                    {{ step }}
                                </li>
                            </ol>
                        </div>
                        <div class="pmbb-view" *ngIf="recipe.notes">
                            <hr>
                            {{ recipe.notes }}
                        </div>
                        <div class="pmbb-view" *ngIf="recipe.originalUrl">
                            <hr>
                            Source : <a [href]="recipe.originalUrl" target="_blank">{{ recipe.originalUrl }}</a>
                        </div>
                    </div>
                    
                    <div class="timers">
                        <timer *ngFor="let timer of activeTimers$ | async" [timer]="timer"></timer>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class RecipeDetailComponent implements OnInit {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    @select('timers') timers$: Observable<Timer[]>;
    paramsSubscriber: any;
    recipe: Recipe;
    serving: ServingOption;

    constructor(
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private recipesActions: RecipesActions,
        private recipeService: RecipeService,
        private timerService: TimerService) {}

    ngOnInit(): void {
        this.paramsSubscriber = this.route.params.subscribe(params => {
            const id = params['id'];
            this.recipeService.get(id).then((recipe) => {
                this.recipe = recipe;

                if (this.recipe.recipeYield) {
                    this.serving = this.getServingOptionForServing(this.recipe.recipeYield);
                } else {
                    this.serving = this.getServingOptionForYield(1);
                }

                this.recipesActions.setCurrentRecipe(recipe);
            });
        });
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    startCooking() {
        this.recipeService.startCooking(this.recipe);
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

        this.recipeService.stopCooking(this.recipe);
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