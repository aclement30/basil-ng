import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TagInputModule } from 'ngx-chips';

import { CoreModule } from '../core/core.module';
import { CookingRecipeService } from './cooking-recipe.service';
import { RecipeService } from './recipe.service';

import { FormSidebarComponent } from './form-sidebar.component';
import { RecipeDetailComponent, CanDeactivateRecipeDetail } from './recipe-detail.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { CookingRecipesActions } from '../store/cooking-recipes.actions';

@NgModule({
    imports: [
      CoreModule,
      CommonModule,
      FormsModule,
      NgbModule,
      RouterModule,
      TagInputModule,
    ],
    declarations: [
      FormSidebarComponent,
      RecipeDetailComponent,
      RecipeFormComponent,
    ],
    providers: [
      CanDeactivateRecipeDetail,
      CookingRecipeService,
      CookingRecipesActions,
      RecipeService,
    ],
})

export class RecipesModule {}
