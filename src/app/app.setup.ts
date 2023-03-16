import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { ReportingAction } from '@reporting/reporting.actions';
import * as fromReporting from '@reporting/reporting.reducer';
import { ReportingState } from '@reporting/reporting.state';
import { AppState } from '@app/app.state';
import { AppAction } from '@app/app.actions';
import * as fromApp from '@app/app.reducer';
import { ErrorPreviewState } from '@error-preview/error-preview.state';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import * as fromErrorPreview from '@error-preview/error-preview.reducer';


export interface MinaState {
  reporting: ReportingState;
  app: AppState;
  error: ErrorPreviewState;
}

type MinaAction =
  & AppAction
  & ErrorPreviewAction
  & ReportingAction
  ;

export const reducers: ActionReducerMap<MinaState, MinaAction> = {
  reporting: fromReporting.reducer,
  app: fromApp.reducer,
  error: fromErrorPreview.reducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
