import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

enum ReportingDashboardActionTypes {
  REPORTING_DASHBOARD_INIT = 'REPORTING_DASHBOARD_INIT',
  REPORTING_DASHBOARD_CLOSE = 'REPORTING_DASHBOARD_CLOSE',
  REPORTING_DASHBOARD_GET_REPORTS = 'REPORTING_DASHBOARD_GET_REPORTS',
  REPORTING_DASHBOARD_GET_REPORTS_SUCCESS = 'REPORTING_DASHBOARD_GET_REPORTS_SUCCESS',
  REPORTING_DASHBOARD_SET_ACTIVE_REPORT = 'REPORTING_DASHBOARD_SET_ACTIVE_REPORT',
  REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS = 'REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS',
  REPORTING_DASHBOARD_MARK_REPORT_TO_SHOW = 'REPORTING_DASHBOARD_MARK_REPORT_TO_SHOW',
  REPORTING_DASHBOARD_BLOCKS_SORT = 'REPORTING_DASHBOARD_BLOCKS_SORT',
  REPORTING_DASHBOARD_PEERS_SORT = 'REPORTING_DASHBOARD_PEERS_SORT',
  REPORTING_DASHBOARD_SELECT_BLOCK = 'REPORTING_DASHBOARD_SELECT_BLOCK',
}

export const REPORTING_DASHBOARD_INIT = ReportingDashboardActionTypes.REPORTING_DASHBOARD_INIT;
export const REPORTING_DASHBOARD_CLOSE = ReportingDashboardActionTypes.REPORTING_DASHBOARD_CLOSE;
export const REPORTING_DASHBOARD_GET_REPORTS = ReportingDashboardActionTypes.REPORTING_DASHBOARD_GET_REPORTS;
export const REPORTING_DASHBOARD_GET_REPORTS_SUCCESS = ReportingDashboardActionTypes.REPORTING_DASHBOARD_GET_REPORTS_SUCCESS;
export const REPORTING_DASHBOARD_SET_ACTIVE_REPORT = ReportingDashboardActionTypes.REPORTING_DASHBOARD_SET_ACTIVE_REPORT;
export const REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS = ReportingDashboardActionTypes.REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS;
export const REPORTING_DASHBOARD_MARK_REPORT_TO_SHOW = ReportingDashboardActionTypes.REPORTING_DASHBOARD_MARK_REPORT_TO_SHOW;
export const REPORTING_DASHBOARD_BLOCKS_SORT = ReportingDashboardActionTypes.REPORTING_DASHBOARD_BLOCKS_SORT;
export const REPORTING_DASHBOARD_PEERS_SORT = ReportingDashboardActionTypes.REPORTING_DASHBOARD_PEERS_SORT;
export const REPORTING_DASHBOARD_SELECT_BLOCK = ReportingDashboardActionTypes.REPORTING_DASHBOARD_SELECT_BLOCK;

export interface ReportingDashboardAction extends FeatureAction<ReportingDashboardActionTypes> {
  readonly type: ReportingDashboardActionTypes;
}

export class ReportingDashboardInit implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_INIT;
}

export class ReportingDashboardClose implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_CLOSE;
}

export class ReportingDashboardGetReports implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_GET_REPORTS;
}

export class ReportingDashboardGetReportsSuccess implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_GET_REPORTS_SUCCESS;

  constructor(public payload: Report[]) { }
}

export class ReportingDashboardSetActiveReport implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_SET_ACTIVE_REPORT;

  constructor(public payload: Report) { }
}

export class ReportingDashboardGetReportDetailSuccess implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_GET_REPORT_DETAIL_SUCCESS;

  constructor(public payload: ReportDetail) { }
}

export class ReportingDashboardMarkReportToShow implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_MARK_REPORT_TO_SHOW;

  constructor(public payload: number) { }
}

export class ReportingDashboardBlocksSort implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_BLOCKS_SORT;

  constructor(public payload: TableSort<ReportDetailBlock>) { }
}

export class ReportingDashboardPeersSort implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_PEERS_SORT;

  constructor(public payload: TableSort<ReportDetailBlockPeerTiming>) { }
}

export class ReportingDashboardSelectBlock implements ReportingDashboardAction {
  readonly type = REPORTING_DASHBOARD_SELECT_BLOCK;

  constructor(public payload: ReportDetailBlock) { }
}


export type ReportingDashboardActions =
  | ReportingDashboardInit
  | ReportingDashboardClose
  | ReportingDashboardGetReports
  | ReportingDashboardGetReportsSuccess
  | ReportingDashboardSetActiveReport
  | ReportingDashboardGetReportDetailSuccess
  | ReportingDashboardMarkReportToShow
  | ReportingDashboardBlocksSort
  | ReportingDashboardPeersSort
  | ReportingDashboardSelectBlock
  ;
