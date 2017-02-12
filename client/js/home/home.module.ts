import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '../core/core.module';

import { RecipesListComponent } from './recipes-list.component';

@NgModule({
    imports: [ CoreModule, CommonModule, NgbModule, RouterModule ],
    declarations: [ RecipesListComponent ],
    providers: [ ],
})

export class HomeModule {}