import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '../core/core.module';

import { TagsActions } from './tags.actions';
import { TagsResolver } from './tags.resolver';
import { TagService } from './tag.service';

@NgModule({
    imports: [ CoreModule, CommonModule, NgbModule, RouterModule ],
    declarations: [ ],
    providers: [ TagsActions, TagsResolver, TagService ],
})

export class TagsModule {}