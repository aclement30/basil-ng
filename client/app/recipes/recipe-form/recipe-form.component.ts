import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select } from 'ng2-redux';

import { DialogService } from '../../core/dialog.service';
import { NotificationService } from '../../core/notification.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Tag } from '../../tags/tag.model';
import { ITags } from '../../redux';

@Component({
    selector: 'recipe-form',
    templateUrl: './recipe-form.component.html',
    styleUrls: ['recipe-form.component.scss'],
})

export class RecipeFormComponent implements OnInit, OnDestroy {

    paramsSubscriber: any;
    recipe: Recipe;
    _recipeTags: Tag[];

    activeTab = 'web-import';
    isImporting = false;
    importError: null;
    isParsed = false;
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
                this.recipeService.get(id)
                  .subscribe(recipe => {
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
            .subscribe((recipe: Recipe) => {
                if (recipe) {
                    this.recipe = recipe;
                }

                this.isImporting = false;
                this.isParsed = true;
            }, (errorMessage: any) => {
              this.isImporting = false;
              this.importError = errorMessage;
            });
    }

    submit(): void {
        const isExisting: boolean = !!this.recipe._id;

        this.recipeService.save(this.recipe)
            .subscribe((recipe: Recipe) => {
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
                return this.recipeService.delete(this.recipe._id).subscribe();
            }, () => {})
            .then(() => {
                this.notificationService.notify('La recette a été supprimée.');
                this.router.navigate(['/']);
            });
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
