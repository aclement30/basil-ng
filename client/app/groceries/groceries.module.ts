import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '../core/core.module';

import { GroceryService } from '../services/grocery.service';

import { AddItemComponent } from './add-item.component';
import { ShoppingListComponent } from './shopping-list.component';

@NgModule({
    imports: [
      CoreModule,
      CommonModule,
      FormsModule,
      NgbModule,
      RouterModule,
      TranslateModule,
    ],
    declarations: [ AddItemComponent, ShoppingListComponent ],
    providers: [ GroceryService ],
})

export class GroceriesModule {}
