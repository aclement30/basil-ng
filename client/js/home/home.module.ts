import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '../core/core.module';
import { TagsModule } from '../tags/tags.module';

import { RecipesListComponent } from './recipes-list.component';
import { RecipesSidebarComponent } from './recipes-sidebar.component';

@NgModule({
    imports: [ CoreModule, CommonModule, NgbModule, RouterModule, TagsModule ],
    declarations: [ RecipesListComponent, RecipesSidebarComponent ],
    providers: [ ],
})

export class HomeModule {}