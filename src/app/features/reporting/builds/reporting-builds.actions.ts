import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

enum ReportingBuildsActionTypes {
  REPORTING_BUILDS_INIT = 'REPORTING_BUILDS_INIT',
  REPORTING_BUILDS_CLOSE = 'REPORTING_BUILDS_CLOSE',
  REPORTING_BUILDS_GET_REPORTS = 'REPORTING_BUILDS_GET_REPORTS',
  REPORTING_BUILDS_GET_REPORTS_SUCCESS = 'REPORTING_BUILDS_GET_REPORTS_SUCCESS',
  REPORTING_BUILDS_MARK_REPORT_TO_SHOW = 'REPORTING_BUILDS_MARK_REPORT_TO_SHOW',
  REPORTING_BUILDS_SET_ACTIVE_REPORT = 'REPORTING_BUILDS_SET_ACTIVE_REPORT',
  REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS = 'REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS',
  REPORTING_BUILDS_BLOCKS_SORT = 'REPORTING_BUILDS_BLOCKS_SORT',
  REPORTING_BUILDS_PEERS_SORT = 'REPORTING_BUILDS_PEERS_SORT',
  REPORTING_BUILDS_SELECT_BLOCK = 'REPORTING_BUILDS_SELECT_BLOCK',
  REPORTING_BUILDS_TOGGLE_FILTER = 'REPORTING_BUILDS_TOGGLE_FILTER',
  REPORTING_BUILDS_TOGGLE_DELTA = 'REPORTING_BUILDS_TOGGLE_DELTA',
}

export const REPORTING_BUILDS_INIT = ReportingBuildsActionTypes.REPORTING_BUILDS_INIT;
export const REPORTING_BUILDS_CLOSE = ReportingBuildsActionTypes.REPORTING_BUILDS_CLOSE;
export const REPORTING_BUILDS_GET_REPORTS = ReportingBuildsActionTypes.REPORTING_BUILDS_GET_REPORTS;
export const REPORTING_BUILDS_GET_REPORTS_SUCCESS = ReportingBuildsActionTypes.REPORTING_BUILDS_GET_REPORTS_SUCCESS;
export const REPORTING_BUILDS_MARK_REPORT_TO_SHOW = ReportingBuildsActionTypes.REPORTING_BUILDS_MARK_REPORT_TO_SHOW;
export const REPORTING_BUILDS_SET_ACTIVE_REPORT = ReportingBuildsActionTypes.REPORTING_BUILDS_SET_ACTIVE_REPORT;
export const REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS = ReportingBuildsActionTypes.REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS;
export const REPORTING_BUILDS_BLOCKS_SORT = ReportingBuildsActionTypes.REPORTING_BUILDS_BLOCKS_SORT;
export const REPORTING_BUILDS_PEERS_SORT = ReportingBuildsActionTypes.REPORTING_BUILDS_PEERS_SORT;
export const REPORTING_BUILDS_SELECT_BLOCK = ReportingBuildsActionTypes.REPORTING_BUILDS_SELECT_BLOCK;
export const REPORTING_BUILDS_TOGGLE_FILTER = ReportingBuildsActionTypes.REPORTING_BUILDS_TOGGLE_FILTER;
export const REPORTING_BUILDS_TOGGLE_DELTA = ReportingBuildsActionTypes.REPORTING_BUILDS_TOGGLE_DELTA;

export interface ReportingBuildsAction extends FeatureAction<ReportingBuildsActionTypes> {
  readonly type: ReportingBuildsActionTypes;
}

export class ReportingBuildsInit implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_INIT;
}

export class ReportingBuildsClose implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_CLOSE;
}

export class ReportingBuildsGetReports implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_GET_REPORTS;
}

export class ReportingBuildsGetReportsSuccess implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_GET_REPORTS_SUCCESS;

  constructor(public payload: Report[]) { }
}

export class ReportingBuildsMarkReportToShow implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_MARK_REPORT_TO_SHOW;

  constructor(public payload: number) { }
}

export class ReportingBuildsSetActiveReport implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_SET_ACTIVE_REPORT;

  constructor(public payload: Report) { }
}

export class ReportingBuildsGetReportDetailSuccess implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS;

  constructor(public payload: ReportDetail) { }
}

export class ReportingBuildsBlocksSort implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_BLOCKS_SORT;

  constructor(public payload: TableSort<ReportDetailBlock>) { }
}

export class ReportingBuildsPeersSort implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_PEERS_SORT;

  constructor(public payload: TableSort<ReportDetailBlockPeerTiming>) { }
}

export class ReportingBuildsSelectBlock implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_SELECT_BLOCK;

  constructor(public payload: ReportDetailBlock) { }
}

export class ReportingBuildsToggleFilter implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class ReportingBuildsToggleDelta implements ReportingBuildsAction {
  readonly type = REPORTING_BUILDS_TOGGLE_DELTA;
}

export type ReportingBuildsActions =
  | ReportingBuildsInit
  | ReportingBuildsClose
  | ReportingBuildsGetReports
  | ReportingBuildsGetReportsSuccess
  | ReportingBuildsMarkReportToShow
  | ReportingBuildsSetActiveReport
  | ReportingBuildsGetReportDetailSuccess
  | ReportingBuildsBlocksSort
  | ReportingBuildsPeersSort
  | ReportingBuildsSelectBlock
  | ReportingBuildsToggleFilter
  | ReportingBuildsToggleDelta
  ;
