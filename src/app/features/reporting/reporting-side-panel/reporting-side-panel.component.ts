import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Report } from '@shared/types/reporting/report.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectActiveReport, selectActiveReportDetail } from '@reporting/reporting.state';
import { ReportingSetActiveReport } from '@reporting/reporting.actions';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';

@Component({
  selector: 'mina-reporting-side-panel',
  templateUrl: './reporting-side-panel.component.html',
  styleUrls: ['./reporting-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column' },
})
export class ReportingSidePanelComponent extends StoreDispatcher implements OnInit {

  activeReport: Report;
  activeReportDetail: ReportDetail;
  activeStep: number = 1;

  ngOnInit(): void {
    this.getActiveReport();
    this.getActiveReportDetail();
  }

  private getActiveReport(): void {
    this.select(selectActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    });
  }

  private getActiveReportDetail(): void {
    this.select(selectActiveReportDetail, (detail: ReportDetail) => {
      this.activeReportDetail = detail;
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(ReportingSetActiveReport, undefined);
  }

  updateStep(step: number): void {
    this.activeStep = step;
  }
}
