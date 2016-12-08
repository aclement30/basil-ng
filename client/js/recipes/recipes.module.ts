import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecipeService } from './recipe.service';

import { KitchenSidebarComponent } from './kitchen-sidebar.component';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeFormComponent } from './recipe-form.component';

@NgModule({
    imports: [ CommonModule, FormsModule, RouterModule ],
    declarations: [ KitchenSidebarComponent, RecipeDetailComponent, RecipeFormComponent ],
    providers: [ RecipeService ],
    exports: [ KitchenSidebarComponent ]
})

export class RecipesModule {}