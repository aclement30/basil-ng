import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { CookingRecipesActions } from './cooking-recipes.actions';
import { DisableCookmode, EnableCookmode } from './ui.actions';

@Injectable()
export class CookingRecipesEffects {
  @Effect() startCooking$: Observable<Action> = this.actions$
    .ofType(CookingRecipesActions.START_COOKING)
    .switchMap((action) => (
      Observable.of(new EnableCookmode())
    ));

  @Effect() stopCooking$: Observable<Action> = this.actions$
    .ofType(CookingRecipesActions.STOP_COOKING)
    .switchMap((action) => (
      Observable.of(new DisableCookmode())
    ));

  constructor(
    private actions$: Actions
  ) {}
}
