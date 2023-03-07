import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';

enum ReportingActionTypes {
  REPORTING_INIT = 'REPORTING_INIT',
  REPORTING_CLOSE = 'REPORTING_CLOSE',
  REPORTING_GET_REPORTS = 'REPORTING_GET_REPORTS',
  REPORTING_GET_REPORTS_SUCCESS = 'REPORTING_GET_REPORTS_SUCCESS',
  REPORTING_MARK_REPORT_TO_SHOW = 'REPORTING_MARK_REPORT_TO_SHOW',
  REPORTING_SET_ACTIVE_REPORT = 'REPORTING_SET_ACTIVE_REPORT',
  REPORTING_GET_REPORT_DETAIL_SUCCESS = 'REPORTING_GET_REPORT_DETAIL_SUCCESS',
}

export const REPORTING_INIT = ReportingActionTypes.REPORTING_INIT;
export const REPORTING_CLOSE = ReportingActionTypes.REPORTING_CLOSE;
export const REPORTING_GET_REPORTS = ReportingActionTypes.REPORTING_GET_REPORTS;
export const REPORTING_GET_REPORTS_SUCCESS = ReportingActionTypes.REPORTING_GET_REPORTS_SUCCESS;
export const REPORTING_MARK_REPORT_TO_SHOW = ReportingActionTypes.REPORTING_MARK_REPORT_TO_SHOW;
export const REPORTING_SET_ACTIVE_REPORT = ReportingActionTypes.REPORTING_SET_ACTIVE_REPORT;
export const REPORTING_GET_REPORT_DETAIL_SUCCESS = ReportingActionTypes.REPORTING_GET_REPORT_DETAIL_SUCCESS;

export interface ReportingAction extends FeatureAction<ReportingActionTypes> {
  readonly type: ReportingActionTypes;
}

export class ReportingInit implements ReportingAction {
  readonly type = REPORTING_INIT;
}

export class ReportingClose implements ReportingAction {
  readonly type = REPORTING_CLOSE;
}

export class ReportingGetReports implements ReportingAction {
  readonly type = REPORTING_GET_REPORTS;
}

export class ReportingGetReportsSuccess implements ReportingAction {
  readonly type = REPORTING_GET_REPORTS_SUCCESS;

  constructor(public payload: Report[]) { }
}

export class ReportingMarkReportToShow implements ReportingAction {
  readonly type = REPORTING_MARK_REPORT_TO_SHOW;

  constructor(public payload: number) { }
}

export class ReportingSetActiveReport implements ReportingAction {
  readonly type = REPORTING_SET_ACTIVE_REPORT;

  constructor(public payload: Report) { }
}

export class ReportingGetReportDetailSuccess implements ReportingAction {
  readonly type = REPORTING_GET_REPORT_DETAIL_SUCCESS;

  constructor(public payload: ReportDetail) { }
}

export type ReportingActions =
  | ReportingInit
  | ReportingClose
  | ReportingGetReports
  | ReportingGetReportsSuccess
  | ReportingMarkReportToShow
  | ReportingSetActiveReport
  | ReportingGetReportDetailSuccess
  ;
