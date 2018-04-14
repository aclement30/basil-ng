import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';
import { TagsModule } from '../tags/tags.module';
import { RecipesModule } from '../recipes/recipes.module';

import { RecipesListComponent } from './recipes-list.component';

@NgModule({
    imports: [
      CoreModule,
      CommonModule,
      NgbModule,
      RecipesModule,
      RouterModule,
      TagsModule,
      TranslateModule,
    ],
    declarations: [ RecipesListComponent ],
    providers: [ ],
})

export class HomeModule {}
