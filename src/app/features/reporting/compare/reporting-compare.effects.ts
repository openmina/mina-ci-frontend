import { Injectable } from '@angular/core';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { ReportingService } from '@reporting/reporting.service';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, map, mergeMap, repeat, switchMap, tap } from 'rxjs';
import { addError } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  REPORTING_COMPARE_CLOSE,
  REPORTING_COMPARE_GET_COMPARE_REPORTS,
  REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS,
  REPORTING_COMPARE_GET_REPORT_DETAIL,
  REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_COMPARE_GET_REPORTS,
  REPORTING_COMPARE_GET_REPORTS_SUCCESS,
  ReportingCompareActions,
  ReportingCompareClose,
  ReportingCompareGetCompareReports,
  ReportingCompareGetReportDetail,
  ReportingCompareGetReports,
} from '@reporting/compare/reporting-compare.actions';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { REPORTING_BUILDS_GET_REPORTS_SUCCESS } from '@reporting/builds/reporting-builds.actions';
import { hasValue } from '@shared/helpers/values.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReportingCompareEffects extends MinaBaseEffect<ReportingCompareActions> {

  readonly getReports$: Effect;
  readonly getComparison$: Effect;
  readonly getReportDetail$: Effect;

  constructor(private actions$: Actions,
              private router: Router,
              private reportingService: ReportingService,
              store: Store<MinaState>) {
    super(store, selectMinaState);

    this.getReports$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_COMPARE_GET_REPORTS, REPORTING_COMPARE_CLOSE),
      this.latestActionState<ReportingCompareGetReports | ReportingCompareClose>(),
      switchMap(({ action }) =>
        action.type === REPORTING_COMPARE_CLOSE
          ? EMPTY
          : this.reportingService.getReports(['success']).pipe(
            map((reports: Report[]) => {
              let ids = action.payload.filter(id => hasValue(id));
              if (ids.length === 0) {
                ids = reports.slice(0, 2).map(report => report.number);
              } else if (ids.length === 1) {
                ids = [ids[0], reports.find(report => report.number !== ids[0])?.number];
              }
              return ({ reports, ids });
            }),
          ),
      ),
      switchMap(({ reports, ids }) => [
        { type: REPORTING_COMPARE_GET_REPORTS_SUCCESS, payload: reports },
        { type: REPORTING_COMPARE_GET_COMPARE_REPORTS, payload: ids },
      ]),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_BUILDS_GET_REPORTS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getComparison$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_COMPARE_GET_COMPARE_REPORTS, REPORTING_COMPARE_CLOSE),
      this.latestActionState<ReportingCompareGetCompareReports | ReportingCompareClose>(),
      switchMap(({ action }) =>
        action.type === REPORTING_COMPARE_CLOSE
          ? EMPTY
          : this.reportingService.getReportsComparison(action.payload),
      ),
      tap((ids: Report[]) => this.router.navigate(['compare'], { queryParams: { compare: ids[0].number, with: ids[1].number } })),
      switchMap((payload: Report[]) => [
        { type: REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS, payload },
        { type: REPORTING_COMPARE_GET_REPORT_DETAIL, payload: 'first' },
        { type: REPORTING_COMPARE_GET_REPORT_DETAIL, payload: 'second' },
      ]),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS, payload: [] },
      ]),
      repeat(),
    ));

    this.getReportDetail$ = createEffect(() => this.actions$.pipe(
      ofType(REPORTING_COMPARE_GET_REPORT_DETAIL, REPORTING_COMPARE_CLOSE),
      this.latestActionState<ReportingCompareGetReportDetail | ReportingCompareClose>(),
      mergeMap(({ action, state }) =>
        action.type === REPORTING_COMPARE_CLOSE
          ? EMPTY
          : this.reportingService.getReportDetail(state.reporting.compare.reports[action.payload === 'first' ? 0 : 1].number).pipe(
            map(detail => ({ detail, type: action.payload })),
          ),
      ),
      map((payload: ({ detail: ReportDetail, type: 'first' | 'second' })) => ({ type: REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS, payload })),
      catchError((error: Error) => [
        addError(error, MinaErrorType.GRAPH_QL),
        { type: REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS, payload: { detail: { blocks: [] }, type: 'first' } },
      ]),
      repeat(),
    ));

  }
}
