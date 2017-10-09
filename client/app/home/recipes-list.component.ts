import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { select } from 'ng2-redux';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { TagsActions } from "../tags/tags.actions";
import {ITags} from "../redux";
import {Tag} from "../tags/tag.model";

@Component({
    selector: 'recipes-list',
    template: `
        <div class="c-header">
            <h2>Recettes</h2>
            <ul class="actions">
                <li>
                    <a [routerLink]="['/recipes/add']" class="btn btn-icon-text btn-link"><i class="zmdi zmdi-plus"></i> Ajouter</a>
                </li>
            </ul>
        </div>
        
        <div class="card c-dark -transparent">
            <div class="action-header">
                <div class="dropdown" ngbDropdown>
                    <button class="btn btn-link btn-icon-text" ngbDropdownToggle *ngIf="(selectedTag$ | async)">{{ (selectedTag$ | async)?.name }}&nbsp;&nbsp;<i class="zmdi zmdi-chevron-down"></i></button>
                    <button class="btn btn-link btn-icon-text" ngbDropdownToggle *ngIf="!(selectedTag$ | async)">Toutes les recettes&nbsp;&nbsp;<i class="zmdi zmdi-chevron-down"></i></button>
    
                    <ul class="dropdown-menu dm-icon">
                        <li>
                            <a [routerLink]="['/recipes']" [ngClass]="{'selected': !(selectedTag$ | async)}">Toutes les recettes</a>
                        </li>
                        <li class="dropdown-item" *ngFor="let tag of (tags$ | async)?.list">
                            <a [routerLink]="['/recipes/tag', tag.alias]" [ngClass]="{selected: (selectedTag$ | async)?._id === tag._id}">{{ tag.name }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4 col-sm-6" *ngFor="let recipe of orderedRecipes" (click)="select(recipe)">
                <div class="card recipe" [style.background-image]="recipe.image ? 'url(' + recipe.image + ')' : null">
                    <div class="card-header">
                        <h2>{{ recipe.title }}</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="card blank-state" *ngIf="!_filteredRecipes.length">
            <div class="card-body card-padding" *ngIf="!recipes.length">
                <i class="blank-icon zmdi zmdi-cutlery"></i>
                <p class="lead">La liste de recettes est vide</p>
                
                <button [routerLink]="['add']" class="btn btn-primary btn-icon-text waves-effect"><i class="zmdi zmdi-plus"></i> Ajouter une recette</button>
            </div>
            
            <div class="card-body card-padding" *ngIf="(selectedTag$ | async)">
                <i class="blank-icon zmdi zmdi-folder-outline"></i>
                <p class="lead">Cette catégorie ne contient aucune recette</p>
            </div>
        </div>
    `,
    styleUrls: ['recipes-list.component.scss'],
})

export class RecipesListComponent implements OnInit, OnDestroy {

    private paramsSubscriber: Subscription;

    recipes: Recipe[];
    _filteredRecipes: Recipe[] = [];

    @select('tags') tags$: Observable<ITags>;

    constructor(
        private recipeService: RecipeService,
        private route: ActivatedRoute,
        private router: Router,
        private tagsActions: TagsActions) { }

    getRecipes(): void {
        this.recipeService.query()
            .then(recipes => {
                this.recipes = recipes;
                this.filterRecipes();
            });
    }

    ngOnInit(): void {
        this.recipes = [];

        this.getRecipes();

        this.paramsSubscriber = this.route.params.subscribe(this.onParamsChange);
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    onParamsChange = (params) => {
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
}
