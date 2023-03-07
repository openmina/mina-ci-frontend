import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';

export interface ReportingState {
  reports: Report[];
  activeReport: Report;
  activeReportDetail: ReportDetail;
  idToShow: number;
}

const select = <T>(selector: (state: ReportingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectReportsState,
  selector,
);

export const selectReportsState = createFeatureSelector<ReportingState>('reporting');
export const selectReports = select((state: ReportingState): Report[] => state.reports);
export const selectActiveReport = select((state: ReportingState): Report => state.activeReport);
export const selectActiveReportDetail = select((state: ReportingState): ReportDetail => state.activeReportDetail);
