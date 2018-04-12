import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {LoginComponent} from './login.component';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      TranslateModule,
    ],
    declarations: [
        LoginComponent,
    ],
    providers: [ ],
    exports: [ LoginComponent ]
})

export class LoginModule {}
