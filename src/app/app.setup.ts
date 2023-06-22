import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromReporting from '@reporting/reporting.reducer';
import { ReportingAction } from '@reporting/reporting.reducer';
import { ReportingState } from '@reporting/reporting.state';
import { AppState } from '@app/app.state';
import { AppAction } from '@app/app.actions';
import * as fromApp from '@app/app.reducer';
import { ErrorPreviewState } from '@error-preview/error-preview.state';
import { ErrorPreviewAction } from '@error-preview/error-preview.actions';
import * as fromErrorPreview from '@error-preview/error-preview.reducer';
import { routerReducer } from '@ngrx/router-store';

export interface MinaState {
  reporting: ReportingState;
  app: AppState;
  error: ErrorPreviewState;
  router: any;
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
  router: routerReducer,
};

export const metaReducers: MetaReducer<MinaState, MinaAction>[] = [];

export const selectMinaState = (state: MinaState): MinaState => state;
