import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Report } from '@shared/types/reporting/report.type';
import { selectReportingCompareState } from '@reporting/reporting.state';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

export interface ReportingCompareState {
  reports: [Report, Report];
  allReports: Report[];
  graphConfig: ReportGraphConfig;
  firstReportDetail: ReportDetail;
  secondReportDetail: ReportDetail;
  firstActiveBlock: ReportDetailBlock;
  secondActiveBlock: ReportDetailBlock;
  blockSort: TableSort<ReportDetailBlock>;
  peerSort: TableSort<ReportDetailBlockPeerTiming>;
}

const select = <T>(selector: (state: ReportingCompareState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectReportingCompareState,
  selector,
);

export const selectReportingCompareReports = select((state: ReportingCompareState): [Report, Report] => state.reports);
export const selectReportingCompareAllReports = select((state: ReportingCompareState): Report[] => state.allReports);
export const selectReportingCompareGraphConfig = select((state: ReportingCompareState): ReportGraphConfig => state.graphConfig);
export const selectReportingCompareFirstReportDetailBlocks = select((state: ReportingCompareState): ReportDetailBlock[] => state.firstReportDetail?.blocks);
export const selectReportingCompareSecondReportDetailBlocks = select((state: ReportingCompareState): ReportDetailBlock[] => state.secondReportDetail?.blocks);
export const selectReportingCompareBlockSort = select((state: ReportingCompareState): TableSort<ReportDetailBlock> => state.blockSort);
export const selectReportingComparePeerSort = select((state: ReportingCompareState): TableSort<ReportDetailBlockPeerTiming> => state.peerSort);
export const selectReportingCompareFirstActiveBlock = select((state: ReportingCompareState): ReportDetailBlock => state.firstActiveBlock);
export const selectReportingCompareSecondActiveBlock = select((state: ReportingCompareState): ReportDetailBlock => state.secondActiveBlock);


