import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '../core/core.module';
import { CookingRecipeService } from './cooking-recipe.service';
import { RecipeService } from './recipe.service';

import { CapitalizePipe } from '../core/capitalize.pipe';
import { IngredientUnitPipe } from '../core/ingredient-unit.pipe';
import { RecipeDetailComponent, CanDeactivateRecipeDetail } from './recipe-detail.component';
import { RecipeFormComponent } from './recipe-form.component';
import { RecipesActions } from '../core/redux.actions';

@NgModule({
    imports: [ CoreModule, CommonModule, FormsModule, NgbModule, RouterModule ],
    declarations: [ CapitalizePipe, IngredientUnitPipe, RecipeDetailComponent, RecipeFormComponent ],
    providers: [ CanDeactivateRecipeDetail, CookingRecipeService, RecipesActions, RecipeService ],
})

export class RecipesModule {}