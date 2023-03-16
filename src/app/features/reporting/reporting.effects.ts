import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import {
  REPORTING_CLOSE,
  REPORTING_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_GET_REPORTS,
  REPORTING_GET_REPORTS_SUCCESS,
  REPORTING_SET_ACTIVE_REPORT, REPORTING_TOGGLE_FILTER,
  ReportingActions,
  ReportingClose,
  ReportingGetReports,
  ReportingSetActiveReport, ReportingToggleFilter,
} from '@reporting/reporting.actions';
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

@Injectable({
  providedIn: 'root',
})
export class ReportingEffects extends MinaBaseEffect<ReportingActions> {

  readonly getReports$: Effect;
  readonly getReportDetail$: Effect;

  constructor(private actions$: Actions,
              private reportingService: ReportingService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getReports$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_GET_REPORTS, REPORTING_TOGGLE_FILTER, REPORTING_CLOSE),
      this.latestActionState<ReportingGetReports | ReportingToggleFilter | ReportingClose>(),
      switchMap(({ action, state }) =>
        action.type === REPORTING_CLOSE ? EMPTY : this.reportingService.getReports(state.reporting.activeFilters)
          .pipe(
            withLatestFrom(this.store.select(state => state.reporting.idToShow)),
            switchMap(([reports, idToShow]) => {
              let actions: ReportingActions[] = [{ type: REPORTING_GET_REPORTS_SUCCESS, payload: reports }];
              if (idToShow) {
                const reportToShow = reports.find(report => report.number === idToShow);
                if (reportToShow) {
                  actions.push({ type: REPORTING_SET_ACTIVE_REPORT, payload: reportToShow });
                }
              }
              return actions;
            }),
          ),
      ),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_GET_REPORTS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getReportDetail$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_SET_ACTIVE_REPORT, REPORTING_CLOSE),
      this.latestActionState<ReportingSetActiveReport | ReportingClose>(),
      switchMap(({ action }) =>
        action.type === REPORTING_CLOSE || action.payload === undefined
          ? EMPTY
          : this.reportingService.getReportDetail(action.payload.number),
      ),
      map((payload: ReportDetail) => ({ type: REPORTING_GET_REPORT_DETAIL_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_GET_REPORT_DETAIL_SUCCESS, payload: undefined },
      ]),
      repeat(),
    ));

  }
}
