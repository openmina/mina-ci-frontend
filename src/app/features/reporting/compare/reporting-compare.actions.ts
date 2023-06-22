import { FeatureAction } from '@shared/types/store/feature-action.type';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

enum ReportingCompareActionTypes {
  REPORTING_COMPARE_INIT = 'REPORTING_COMPARE_INIT',
  REPORTING_COMPARE_CLOSE = 'REPORTING_COMPARE_CLOSE',
  REPORTING_COMPARE_GET_COMPARE_REPORTS = 'REPORTING_COMPARE_GET_COMPARE_REPORTS',
  REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS = 'REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS',
  REPORTING_COMPARE_GET_REPORTS = 'REPORTING_COMPARE_GET_REPORTS',
  REPORTING_COMPARE_GET_REPORTS_SUCCESS = 'REPORTING_COMPARE_GET_REPORTS_SUCCESS',
  REPORTING_COMPARE_GET_REPORT_DETAIL = 'REPORTING_COMPARE_GET_REPORT_DETAIL',
  REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS = 'REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS',
  REPORTING_COMPARE_BLOCKS_SORT = 'REPORTING_COMPARE_BLOCKS_SORT',
  REPORTING_COMPARE_PEERS_SORT = 'REPORTING_COMPARE_PEERS_SORT',
  REPORTING_COMPARE_SELECT_FIRST_BLOCK = 'REPORTING_COMPARE_SELECT_FIRST_BLOCK',
  REPORTING_COMPARE_SELECT_SECOND_BLOCK = 'REPORTING_COMPARE_SELECT_SECOND_BLOCK',
}

export const REPORTING_COMPARE_INIT = ReportingCompareActionTypes.REPORTING_COMPARE_INIT;
export const REPORTING_COMPARE_CLOSE = ReportingCompareActionTypes.REPORTING_COMPARE_CLOSE;
export const REPORTING_COMPARE_GET_COMPARE_REPORTS = ReportingCompareActionTypes.REPORTING_COMPARE_GET_COMPARE_REPORTS;
export const REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS = ReportingCompareActionTypes.REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS;
export const REPORTING_COMPARE_GET_REPORTS = ReportingCompareActionTypes.REPORTING_COMPARE_GET_REPORTS;
export const REPORTING_COMPARE_GET_REPORTS_SUCCESS = ReportingCompareActionTypes.REPORTING_COMPARE_GET_REPORTS_SUCCESS;
export const REPORTING_COMPARE_GET_REPORT_DETAIL = ReportingCompareActionTypes.REPORTING_COMPARE_GET_REPORT_DETAIL;
export const REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS = ReportingCompareActionTypes.REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS;
export const REPORTING_COMPARE_BLOCKS_SORT = ReportingCompareActionTypes.REPORTING_COMPARE_BLOCKS_SORT;
export const REPORTING_COMPARE_PEERS_SORT = ReportingCompareActionTypes.REPORTING_COMPARE_PEERS_SORT;
export const REPORTING_COMPARE_SELECT_FIRST_BLOCK = ReportingCompareActionTypes.REPORTING_COMPARE_SELECT_FIRST_BLOCK;
export const REPORTING_COMPARE_SELECT_SECOND_BLOCK = ReportingCompareActionTypes.REPORTING_COMPARE_SELECT_SECOND_BLOCK;

export interface ReportingCompareAction extends FeatureAction<ReportingCompareActionTypes> {
  readonly type: ReportingCompareActionTypes;
}

export class ReportingCompareInit implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_INIT;
}

export class ReportingCompareClose implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_CLOSE;
}

export class ReportingCompareGetCompareReports implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_COMPARE_REPORTS;

  constructor(public payload: [number, number]) { }
}

export class ReportingCompareGetCompareReportsSuccess implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS;

  constructor(public payload: [Report, Report]) { }
}

export class ReportingCompareGetReports implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_REPORTS;

  constructor(public payload: number[]) { }
}

export class ReportingCompareGetReportsSuccess implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_REPORTS_SUCCESS;

  constructor(public payload: Report[]) { }
}

export class ReportingCompareGetReportDetail implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_REPORT_DETAIL;

  constructor(public payload: 'first' | 'second') { }
}

export class ReportingCompareGetReportDetailSuccess implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS;

  constructor(public payload: { detail: ReportDetail, type: 'first' | 'second' }) { }
}

export class ReportingCompareBlocksSort implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_BLOCKS_SORT;

  constructor(public payload: TableSort<ReportDetailBlock>) { }
}

export class ReportingComparePeersSort implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_PEERS_SORT;

  constructor(public payload: TableSort<ReportDetailBlockPeerTiming>) { }
}

export class ReportingCompareSelectFirstBlock implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_SELECT_FIRST_BLOCK;

  constructor(public payload: ReportDetailBlock) { }
}

export class ReportingCompareSelectSecondBlock implements ReportingCompareAction {
  readonly type = REPORTING_COMPARE_SELECT_SECOND_BLOCK;

  constructor(public payload: ReportDetailBlock) { }
}

export type ReportingCompareActions =
  | ReportingCompareInit
  | ReportingCompareClose
  | ReportingCompareGetCompareReports
  | ReportingCompareGetCompareReportsSuccess
  | ReportingCompareGetReports
  | ReportingCompareGetReportsSuccess
  | ReportingCompareGetReportDetail
  | ReportingCompareGetReportDetailSuccess
  | ReportingCompareBlocksSort
  | ReportingComparePeersSort
  | ReportingCompareSelectFirstBlock
  | ReportingCompareSelectSecondBlock
  ;
