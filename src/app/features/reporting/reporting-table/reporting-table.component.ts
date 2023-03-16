import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Router } from '@angular/router';
import { selectReportingActiveReport, selectReportingDelta, selectReportingGraphConfig, selectReports } from '@reporting/reporting.state';
import { Report } from '@shared/types/reporting/report.type';
import { ReportingSetActiveReport } from '@reporting/reporting.actions';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { reportingIconMap } from '@reporting/reporting-toolbar/reporting-toolbar.component';

@Component({
  selector: 'mina-reporting-table',
  templateUrl: './reporting-table.component.html',
  styleUrls: ['./reporting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class ReportingTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 172;
  readonly iconMap = reportingIconMap

  reports: Report[];
  activeReport: Report;
  graphConfig: ReportGraphConfig;
  delta: boolean;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToGraphConfigChange();
    this.listenToReportsChange();
    this.listenToDeltaChanging();
  }

  private listenToActiveRowChange(): void {
    this.select(selectReportingActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    });
  }

  private listenToGraphConfigChange(): void {
    this.select(selectReportingGraphConfig, (graphConfig: ReportGraphConfig) => {
      this.graphConfig = graphConfig;
    });
  }

  private listenToReportsChange(): void {
    this.select(selectReports, (reports: Report[]) => {
      this.reports = reports;
      this.detect();
    });
  }

  private listenToDeltaChanging(): void {
    this.select(selectReportingDelta, (delta: boolean) => {
      this.delta = delta;
      this.detect();
    });
  }

  onRowClick(report: Report): void {
    if (report !== this.activeReport) {
      this.router.navigate([report.number], { queryParamsHandling: 'merge' });
      this.dispatch(ReportingSetActiveReport, report);
    }
  }
}
