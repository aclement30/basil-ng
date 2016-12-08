import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { select } from 'ng2-redux';

import { ICookingRecipes } from '../redux';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

@Component({
    selector: 'recipe-detail',
    template: `
        <div class="c-header" *ngIf="recipe">
            <h2>{{ recipe.title }}</h2>
            
            <ul class="actions a-alt">
                <li>
                    <a [routerLink]="['/recipes/edit', recipe._id]">
                        <i class="zmdi zmdi-edit"></i>
                    </a>
                </li>
            </ul>
        </div>

        <div class="card" *ngIf="recipe">
            <div class="left">
                <div class="recipe-picture" *ngIf="recipe.image" [style.background-image]="'url(' + recipe.image + ')'">
                    <div class="cooking-recipe" *ngIf="isCooking$ | async">
                        <i class="zmdi zmdi-fire"></i> <span class="hidden-xs">Recette </span>en cours
                    </div>
                    <button (click)="stopCooking()" class="stop-cooking" *ngIf="isCooking$ | async">
                        <i class="zmdi zmdi-assignment-check"></i> Terminer<span class="hidden-xs"> la recette</span>
                    </button>
                </div>
                
                <button (click)="startCooking()" *ngIf="!(isCooking$ | async)" class="btn start-cooking btn-float btn-primary btn-icon waves-effect waves-circle waves-float"><i class="zmdi zmdi-cutlery"></i></button>

                <div class="pmo-block">
                    <h2>Ingrédients</h2>

                    <ul class="ingredients">
                        <li *ngFor="let ingredient of recipe.ingredients">{{ ingredient.description }}</li>
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
                                <li ngbDropdown *ngFor="let step of recipe.recipeInstructions; let i = index">
                                    <button class="step" ngbDropdownToggle><span>{{ (i + 1) }}</span><i class="zmdi zmdi-hourglass-alt"></i></button>
                                    <ul class="dropdown-menu">
                                        <li class="dropdown-item">
                                            <a (click)="logout()"><i class="zmdi zmdi-time-restore"></i> Déconnexion</a>
                                        </li>
                                    </ul>
                                    
                                    {{ step }}
                                </li>
                            </ol>
                        </div>
                        <div class="pmbb-view" *ngIf="recipe.notes">
                            <hr>
                            {{ recipe.notes }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})

export class RecipeDetailComponent implements OnInit {
    @select('cookingRecipes') cookingRecipes$: Observable<ICookingRecipes>;
    paramsSubscriber: any;
    recipe: Recipe;

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService) {}

    ngOnInit(): void {
        this.paramsSubscriber = this.route.params.subscribe(params => {
            const id = params['id'];
            this.recipeService.get(id).then(recipe => this.recipe = recipe);
        });
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    startCooking() {
        this.recipeService.startCooking(this.recipe);
    }

    stopCooking() {
        this.recipeService.stopCooking(this.recipe);
    }

    get isCooking$(): Observable<boolean> {
        return this.cookingRecipes$.map((cookingRecipes: ICookingRecipes) => {
            return cookingRecipes.list.some(recipe => (recipe._id === this.recipe._id));
        });
    }
}