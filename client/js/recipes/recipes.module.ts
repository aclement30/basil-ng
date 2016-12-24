import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecipeService } from './recipe.service';

import { CapitalizePipe } from '../core/capitalize.pipe';
import { IngredientUnitPipe } from '../core/ingredient-unit.pipe';
import { KitchenSidebarComponent } from './kitchen-sidebar.component';
import { RecipeDetailComponent, CanDeactivateRecipeDetail } from './recipe-detail.component';
import { RecipeFormComponent } from './recipe-form.component';
import { RecipesActions } from '../core/redux.actions';

@NgModule({
    imports: [ CommonModule, FormsModule, RouterModule ],
    declarations: [ CapitalizePipe, IngredientUnitPipe, KitchenSidebarComponent, RecipeDetailComponent, RecipeFormComponent ],
    providers: [ CanDeactivateRecipeDetail, RecipesActions, RecipeService ],
    exports: [ KitchenSidebarComponent ]
})

export class RecipesModule {}