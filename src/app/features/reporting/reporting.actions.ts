import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { TableSort } from '@app/shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

enum ReportingActionTypes {
  REPORTING_INIT = 'REPORTING_INIT',
  REPORTING_CLOSE = 'REPORTING_CLOSE',
  REPORTING_GET_REPORTS = 'REPORTING_GET_REPORTS',
  REPORTING_GET_REPORTS_SUCCESS = 'REPORTING_GET_REPORTS_SUCCESS',
  REPORTING_MARK_REPORT_TO_SHOW = 'REPORTING_MARK_REPORT_TO_SHOW',
  REPORTING_SET_ACTIVE_REPORT = 'REPORTING_SET_ACTIVE_REPORT',
  REPORTING_GET_REPORT_DETAIL_SUCCESS = 'REPORTING_GET_REPORT_DETAIL_SUCCESS',
  REPORTING_BLOCKS_SORT = 'REPORTING_BLOCKS_SORT',
  REPORTING_PEERS_SORT = 'REPORTING_PEERS_SORT',
  REPORTING_SELECT_BLOCK = 'REPORTING_SELECT_BLOCK',
  REPORTING_TOGGLE_FILTER = 'REPORTING_TOGGLE_FILTER',
  REPORTING_TOGGLE_DELTA = 'REPORTING_TOGGLE_DELTA',
}

export const REPORTING_INIT = ReportingActionTypes.REPORTING_INIT;
export const REPORTING_CLOSE = ReportingActionTypes.REPORTING_CLOSE;
export const REPORTING_GET_REPORTS = ReportingActionTypes.REPORTING_GET_REPORTS;
export const REPORTING_GET_REPORTS_SUCCESS = ReportingActionTypes.REPORTING_GET_REPORTS_SUCCESS;
export const REPORTING_MARK_REPORT_TO_SHOW = ReportingActionTypes.REPORTING_MARK_REPORT_TO_SHOW;
export const REPORTING_SET_ACTIVE_REPORT = ReportingActionTypes.REPORTING_SET_ACTIVE_REPORT;
export const REPORTING_GET_REPORT_DETAIL_SUCCESS = ReportingActionTypes.REPORTING_GET_REPORT_DETAIL_SUCCESS;
export const REPORTING_BLOCKS_SORT = ReportingActionTypes.REPORTING_BLOCKS_SORT;
export const REPORTING_PEERS_SORT = ReportingActionTypes.REPORTING_PEERS_SORT;
export const REPORTING_SELECT_BLOCK = ReportingActionTypes.REPORTING_SELECT_BLOCK;
export const REPORTING_TOGGLE_FILTER = ReportingActionTypes.REPORTING_TOGGLE_FILTER;
export const REPORTING_TOGGLE_DELTA = ReportingActionTypes.REPORTING_TOGGLE_DELTA;

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

export class ReportingBlocksSort implements ReportingAction {
  readonly type = REPORTING_BLOCKS_SORT;

  constructor(public payload: TableSort<ReportDetailBlock>) { }
}

export class ReportingPeersSort implements ReportingAction {
  readonly type = REPORTING_PEERS_SORT;

  constructor(public payload: TableSort<ReportDetailBlockPeerTiming>) { }
}

export class ReportingSelectBlock implements ReportingAction {
  readonly type = REPORTING_SELECT_BLOCK;

  constructor(public payload: ReportDetailBlock) { }
}

export class ReportingToggleFilter implements ReportingAction {
  readonly type = REPORTING_TOGGLE_FILTER;

  constructor(public payload: string) { }
}

export class ReportingToggleDelta implements ReportingAction {
  readonly type = REPORTING_TOGGLE_DELTA;
}

export type ReportingActions =
  | ReportingInit
  | ReportingClose
  | ReportingGetReports
  | ReportingGetReportsSuccess
  | ReportingMarkReportToShow
  | ReportingSetActiveReport
  | ReportingGetReportDetailSuccess
  | ReportingBlocksSort
  | ReportingPeersSort
  | ReportingSelectBlock
  | ReportingToggleFilter
  | ReportingToggleDelta
  ;
