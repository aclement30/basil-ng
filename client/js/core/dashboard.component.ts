import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Component({
    selector: 'dashboard',
    template: `
        <div class="c-header">
            <h2>Recettes</h2>
        </div>

        <div class="row">
            <div class="col-md-4 col-sm-6" *ngFor="let recipe of recipes" (click)="select(recipe)">
                <div class="card recipe" [style.background-image]="'url(' + recipe.image + ')'">
                    <div class="card-header">
                        <h2>{{ recipe.title }}</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="card blank-state" *ngIf="!recipes.length">
            <div class="card-body card-padding">
                <i class="blank-icon zmdi zmdi-cutlery"></i>
                <p class="lead">La liste de recettes est vide</p>
                
                <button [routerLink]="['add']" class="btn btn-primary btn-icon-text waves-effect"><i class="zmdi zmdi-plus"></i> Ajouter une recette</button>
            </div>
        </div>
    `
})

export class DashboardComponent implements OnInit {

    recipes: Recipe[];

    constructor(
        private recipeService: RecipeService,
        private router: Router) { }

    getRecipes(): void {
        this.recipeService.query()
            .then(recipes => {
                this.recipes = recipes;
            });
    }

    ngOnInit(): void {
        this.recipes = [];

        this.getRecipes();
    }

    select(recipe: Recipe): void {
        this.router.navigate(['/recipes/detail', recipe._id]);
    }
}