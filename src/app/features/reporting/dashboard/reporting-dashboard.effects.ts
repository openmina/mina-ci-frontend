import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { ReportingService } from '@reporting/reporting.service';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, repeat, switchMap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { withLatestFrom } from 'rxjs/operators';
import {
  REPORTING_DASHBOARD_CLOSE,
  REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_DASHBOARD_GET_REPORTS,
  REPORTING_DASHBOARD_GET_REPORTS_SUCCESS,
  REPORTING_DASHBOARD_SET_ACTIVE_REPORT,
  ReportingDashboardActions,
  ReportingDashboardClose,
  ReportingDashboardGetReports,
  ReportingDashboardSetActiveReport,
} from '@reporting/dashboard/reporting-dashboard.actions';

@Injectable({
  providedIn: 'root',
})
export class ReportingDashboardEffects extends MinaBaseEffect<ReportingDashboardActions> {

  readonly getReports$: Effect;
  readonly getReportDetail$: Effect;

  constructor(private actions$: Actions,
              private reportingService: ReportingService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getReports$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_DASHBOARD_GET_REPORTS, REPORTING_DASHBOARD_CLOSE),
      this.latestActionState<ReportingDashboardGetReports | ReportingDashboardClose>(),
      switchMap(({ action, state }) =>
        action.type === REPORTING_DASHBOARD_CLOSE ? EMPTY : this.reportingService.getReports(['success'])
          .pipe(
            withLatestFrom(this.store.select(state => state.reporting.dashboard.idToShow)),
            switchMap(([reports, idToShow]) => {
              let actions: ReportingDashboardActions[] = [{ type: REPORTING_DASHBOARD_GET_REPORTS_SUCCESS, payload: reports }];
              if (idToShow) {
                const reportToShow = reports.find(report => report.number === idToShow);
                if (reportToShow) {
                  actions.push({ type: REPORTING_DASHBOARD_SET_ACTIVE_REPORT, payload: reportToShow });
                }
              }
              return actions;
            }),
          ),
      ),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_DASHBOARD_GET_REPORTS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getReportDetail$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_DASHBOARD_SET_ACTIVE_REPORT, REPORTING_DASHBOARD_CLOSE),
      this.latestActionState<ReportingDashboardSetActiveReport | ReportingDashboardClose>(),
      switchMap(({ action }) =>
        action.type === REPORTING_DASHBOARD_CLOSE || action.payload === undefined
          ? EMPTY
          : this.reportingService.getReportDetail(action.payload.number),
      ),
      map((payload: ReportDetail) => ({ type: REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS, payload: undefined },
      ]),
      repeat(),
    ));

  }

}
