import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from 'ng2-redux';
import { Observable } from "rxjs";

import { DialogService } from '../core/dialog.service';
import { NotificationService } from '../core/notification.service';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';
import { Tag } from '../tags/tag.model';
import { ITags } from "../redux";

@Component({
    selector: 'recipe-form',
    template: `
        <form #recipeForm="ngForm" *ngIf="recipe">
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
                    <ul class="tab-nav" *ngIf="!this.recipe._id">
                        <li [ngClass]="{active: activeTab === 'web-import'}"><a (click)="toggleTab('web-import')">Recette Web</a></li>
                        <li [ngClass]="{active: activeTab === 'normal'}"><a (click)="toggleTab('normal')">Nouvelle recette</a></li>
                    </ul>
                
                    <div class="form-group web-recipe-import" *ngIf="activeTab === 'web-import' && !isParsed && !this.recipe._id" [ngClass]="{'has-error': importError && recipe.originalUrl}">
                        <div class="fg-line">
                            <div class="row">
                                <input type="url" [(ngModel)]="recipe.originalUrl" name="url" class="form-control" placeholder="http://" #sourceUrl="ngModel" required>
                                <button type="button" (click)="importRecipe()" class="btn btn-primary waves-effect" [disabled]="!sourceUrl.valid || isImporting">Importer</button>
                            </div>
                            <small class="c-gray" [hidden]="importError && recipe.originalUrl">Entrez l'URL de la page Web contenant la recette</small>
                            <small [hidden]="!importError || !recipe.originalUrl" class="help-block">{{ importError }}</small>
                        </div>
                    </div>

                    <div class="recipe-fields" *ngIf="activeTab === 'normal' || isParsed || this.recipe._id">
                        <div class="form-group" [ngClass]="{'has-error': title.invalid && title.dirty}">
                            <label>Titre</label>
                            <div class="fg-line">
                                <input type="text" [(ngModel)]="recipe.title" name="title" class="form-control" placeholder="Titre" #title="ngModel" required>
                            </div>
                            <small [hidden]="title.valid || title.pristine" class="help-block">Champ requis</small>
                        </div>
                        
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group fg-float" [ngClass]="{'has-error': ingredients.invalid && ingredients.dirty}">
                                    <label>Ingrédients</label>
                                    <textarea autosize [(ngModel)]="recipe.combinedIngredients" class="form-control" name="ingredients" placeholder="Ingrédients" #ingredients="ngModel" required></textarea>
                                    <small [hidden]="ingredients.valid || ingredients.pristine" class="help-block">Champ requis</small>
                                </div>
                                
                                <snap-uploader type="ocr/SCAN_INGREDIENTS" (getResult)="getSnapshotIngredients($event)"></snap-uploader>
                            </div>
                            
                            <div class="col-sm-8">
                                <div class="form-group fg-float" [ngClass]="{'has-error': instructions.invalid && instructions.dirty}">
                                    <label>Étapes de préparation</label>
                                    <div class="fg-line">
                                        <textarea autosize [(ngModel)]="recipe.combinedInstructions" class="form-control" name="instructions" placeholder="Étapes de préparation" #instructions="ngModel" required></textarea>
                                    </div>
                                    <small [hidden]="instructions.valid || instructions.pristine" class="help-block">Champ requis</small>
                                </div>
                                
                                <snap-uploader type="ocr/SCAN_INSTRUCTIONS" (getResult)="getSnapshotInstructions($event)"></snap-uploader>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <label>Portions</label>
                                    <div class="fg-line">
                                        <input type="text" [(ngModel)]="recipe.recipeYield" name="yield" class="form-control" placeholder="Rendement">
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-9">
                                <div class="form-group">
                                    <label>Catégories</label>
                                    <div class="fg-line">
                                        <tag-input [(ngModel)]="recipeTags" name="tags" placeholder="Autres catégories" secondaryPlaceholder="Cakes, Entrées..." [identifyBy]="'_id'" [displayBy]="'name'" onlyFromAutocomplete="true">
                                            <tag-input-dropdown [autocompleteItems]="tags" [identifyBy]="'_id'" [displayBy]="'name'"></tag-input-dropdown>
                                        </tag-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                                 
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Photo</label>
                                    <div class="fg-line">
                                        <input type="url" [(ngModel)]="recipe.image" name="image" class="form-control" placeholder="Photo (URL)">
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label>Source</label>
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
    _recipeTags: Tag[];

    activeTab: string = 'web-import';
    isImporting: boolean = false;
    importError: null;
    isParsed: boolean = false;
    tags: Tag[] = [];

    @select('tags') tags$: Observable<ITags>;

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
                this.recipeService.get(id).then(recipe => {
                    this.recipe = recipe;
                    this.updateCachedTags(this.recipe.tags);
                    return recipe;
                });
            } else {
                this.recipe = new Recipe();
            }
        });

        this.tags$.first().subscribe((tags: ITags) => {
            this.tags = tags.list;
        });
    }

    getSnapshotIngredients(ingredients: [string]) {
        this.recipe.combinedIngredients += ingredients.join("\n");
    }

    getSnapshotInstructions(instructions: [string]) {
        this.recipe.combinedInstructions += "\n" + instructions.join("\n");
    }

    ngOnDestroy() {
        this.paramsSubscriber.unsubscribe();
    }

    importRecipe() {
        this.isImporting = true;
        this.importError = null;

        this.recipeService.import(this.recipe.originalUrl)
            .then((recipe: Recipe) => {
                if (recipe) {
                    this.recipe = recipe;
                }

                this.isImporting = false;
                this.isParsed = true;
            })
            .catch((errorMessage: any) => {
                this.isImporting = false;
                this.importError = errorMessage;
            });
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

    toggleTab(alias: string): void {
        this.activeTab = alias;

        if (alias === 'web-import') {
            this.isParsed = false;
        }
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

    private updateCachedTags(tagIds: String[]) {
        this._recipeTags = tagIds.map(tagId => this.tags.find(tag => tag._id === tagId));
    }

    get recipeTags(): Tag[] {
        return this._recipeTags;
    }

    set recipeTags(tags: Tag[]) {
        this.recipe.tags = tags.map(tag => tag._id);
        this.updateCachedTags(this.recipe.tags);
    }
}