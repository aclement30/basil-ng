import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DialogService } from '../core/dialog.service';
import { NotificationService } from '../core/notification.service';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

@Component({
    selector: 'recipe-form',
    template: `
        <form name="recipeForm" #recipeForm="ngForm" *ngIf="recipe">
            <div class="c-header">
                <h2>{{ recipe._id ? 'Modifier la recette' : 'Ajouter une recette' }}</h2>
                
                <ul class="actions a-alt">
                    <li>
                        <button class="btn btn-icon-text btn-link" (click)="submit()" [disabled]="!recipeForm.valid"><i class="zmdi zmdi-check"></i> Enregistrer</button>
                    </li>
                </ul>
            </div>
    
            <div class="card">
                <div class="card-body card-padding">
                    <div class="form-group has-error" [ngClass]="{'has-error': title.invalid && title.dirty}">
                        <div class="fg-line">
                            <input type="text" [(ngModel)]="recipe.title" name="title" class="form-control" placeholder="Titre" #title="ngModel" required>
                        </div>
                        <small [hidden]="title.valid || title.pristine" class="help-block">Champ requis</small>
                    </div>
                    
                    <div class="row">
                        <div class="col-sm-4">
                            <p class="c-black f-500 m-b-5">Ingrédients</p>
                            <div class="form-group fg-float" [ngClass]="{'has-error': ingredients.invalid && ingredients.dirty}">
                                <div class="fg-line">
                                    <textarea [(ngModel)]="recipe.combinedIngredients" class="form-control" name="ingredients" rows="15" placeholder="Ingrédients" #ingredients="ngModel" required></textarea>
                                </div>
                                <small [hidden]="ingredients.valid || ingredients.pristine" class="help-block">Champ requis</small>
                            </div>
                        </div>
                        
                        <div class="col-sm-8">
                            <p class="c-black f-500 m-b-5">Étapes de préparation</p>
                            <div class="form-group fg-float" [ngClass]="{'has-error': instructions.invalid && instructions.dirty}">
                                <div class="fg-line">
                                    <textarea [(ngModel)]="recipe.combinedInstructions" class="form-control" name="instructions" rows="15" placeholder="Étapes de préparation" #instructions="ngModel" required></textarea>
                                </div>
                                <small [hidden]="instructions.valid || instructions.pristine" class="help-block">Champ requis</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-sm-3">
                            <div class="form-group">
                                <div class="fg-line">
                                    <input type="text" [(ngModel)]="recipe.recipeYield" name="yield" class="form-control" placeholder="Rendement">
                                </div>
                            </div>
                        </div>
                    </div>
                             
                    <p class="c-black f-500 m-b-5">Autres informations</p>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <div class="fg-line">
                                    <input type="url" [(ngModel)]="recipe.image" name="image" class="form-control" placeholder="Photo (URL)">
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <div class="fg-line">
                                    <input type="url" [(ngModel)]="recipe.originalUrl" name="image" class="form-control" placeholder="Source (URL)">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <div class="fg-line">
                            <input type="text" [(ngModel)]="recipe.notes" name="notes" class="form-control" placeholder="Notes">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center" *ngIf="recipe._id">
                <button type="button" class="btn btn-warning btn-icon-text waves-effect" (click)="remove()"><i class="zmdi zmdi-delete"></i> Supprimer la recette</button>
            </div>
        </form>
    `
})

export class RecipeFormComponent implements OnInit {

    paramsSubscriber: any;
    recipe: Recipe;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialogService: DialogService,
        private notificationService: NotificationService,
        private recipeService: RecipeService) {}

    ngOnInit(): void {
        this.paramsSubscriber = this.route.params.subscribe(params => {
            const id = params['id'];

            if (id) {
                this.recipeService.get(id).then(recipe => this.recipe = recipe);
            } else {
                this.recipe = new Recipe();
            }
        });
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    submit(): void {
        const isExisting: boolean = !!this.recipe._id;

        this.recipeService.save(this.recipe)
            .then((recipe: Recipe) => {
                if (isExisting) {
                    this.notificationService.notify('La recette a été enregistrée.');
                } else {
                    this.notificationService.notify('La recette a été ajoutée.');
                }

                this.router.navigate(['recipes', 'detail', recipe._id]);
            });
    }

    remove(): void {
        this.dialogService.confirm('Voulez-vous vraiment supprimer cette recette ?')
            .then(() => {
                return this.recipeService.delete(this.recipe._id);
            }, () => {})
            .then(() => {
                this.notificationService.notify('La recette a été supprimée.');
                this.router.navigate(['/']);
            })
    }
}