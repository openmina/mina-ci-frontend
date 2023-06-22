import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { AppActions } from '@app/app.actions';
import { createNonDispatchableEffect } from '@shared/constants/store-functions';

const INIT_EFFECTS = '@ngrx/effects/init';

@Injectable({
  providedIn: 'root',
})
export class AppEffects extends MinaBaseEffect<AppActions> {

  readonly initEffects$: Effect;

  constructor(private actions$: Actions,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.initEffects$ = createNonDispatchableEffect(() => this.actions$.pipe(
      ofType(INIT_EFFECTS),
    ));

    store.dispatch({ type: INIT_EFFECTS });
  }
}
