import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';

export interface ReportingState {
  reports: Report[];
  activeReport: Report;
  activeReportDetail: ReportDetail;
  idToShow: number;
  sort: TableSort<ReportDetailBlock>;
  activeBlock: ReportDetailBlock;
  peerSort: TableSort<ReportDetailBlockPeerTiming>;
  activeFilters: string[];
  graphConfig: ReportGraphConfig;
  delta: boolean;
}

const select = <T>(selector: (state: ReportingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectReportsState,
  selector,
);

export const selectReportsState = createFeatureSelector<ReportingState>('reporting');
export const selectReports = select((state: ReportingState): Report[] => state.reports);
export const selectReportingActiveReport = select((state: ReportingState): Report => state.activeReport);
export const selectReportingActiveReportDetail = select((state: ReportingState): ReportDetail => state.activeReportDetail);
export const selectReportingSort = select((state: ReportingState): TableSort<ReportDetailBlock> => state.sort);
export const selectReportingActiveBlock = select((state: ReportingState): ReportDetailBlock => state.activeBlock);
export const selectReportingPeerSort = select((state: ReportingState): TableSort<ReportDetailBlockPeerTiming> => state.peerSort);
export const selectReportingActiveFilters = select((state: ReportingState): string[] => state.activeFilters);
export const selectReportingGraphConfig = select((state: ReportingState): ReportGraphConfig => state.graphConfig);
export const selectReportingDelta = select((state: ReportingState): boolean => state.delta);
