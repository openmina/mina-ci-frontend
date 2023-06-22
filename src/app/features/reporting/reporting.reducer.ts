import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromBuilds from '@reporting/builds/reporting-builds.reducer';
import * as fromCompare from '@reporting/compare/reporting-compare.reducer';
import * as fromDashboard from '@reporting/dashboard/reporting-dashboard.reducer';
import { ReportingState } from '@reporting/reporting.state';
import { ReportingBuildsAction, ReportingBuildsActions } from '@reporting/builds/reporting-builds.actions';
import { ReportingCompareAction, ReportingCompareActions } from '@reporting/compare/reporting-compare.actions';
import { ReportingDashboardAction, ReportingDashboardActions } from '@reporting/dashboard/reporting-dashboard.actions';

export type ReportingActions =
  & ReportingBuildsActions
  & ReportingCompareActions
  & ReportingDashboardActions
  ;
export type ReportingAction =
  & ReportingBuildsAction
  & ReportingCompareAction
  & ReportingDashboardAction
  ;

export const reducer: ActionReducer<ReportingState, ReportingActions> = combineReducers<ReportingState, ReportingActions>({
  builds: fromBuilds.reducer,
  compare: fromCompare.reducer,
  dashboard: fromDashboard.reducer,
});
