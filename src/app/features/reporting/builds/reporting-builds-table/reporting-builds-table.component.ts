import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { reportingIconMap } from '@reporting/builds/reporting-builds-toolbar/reporting-builds-toolbar.component';
import { Report } from '@shared/types/reporting/report.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { Router } from '@angular/router';
import { selectReportingBuildsActiveReport, selectReportingBuildsDelta, selectReportingBuildsGraphConfig, selectReportingBuildsReports } from '@reporting/builds/reporting-builds.state';
import { ReportingBuildsSetActiveReport } from '@reporting/builds/reporting-builds.actions';
import { CONFIG } from '@shared/constants/config';

@Component({
  selector: 'mina-reporting-builds-table',
  templateUrl: './reporting-builds-table.component.html',
  styleUrls: ['./reporting-builds-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class ReportingBuildsTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 172;
  readonly iconMap = reportingIconMap;
  readonly droneUrl: string = CONFIG.drone;

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
    this.select(selectReportingBuildsActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    });
  }

  private listenToGraphConfigChange(): void {
    this.select(selectReportingBuildsGraphConfig, (graphConfig: ReportGraphConfig) => {
      this.graphConfig = graphConfig;
    });
  }

  private listenToReportsChange(): void {
    this.select(selectReportingBuildsReports, (reports: Report[]) => {
      this.reports = reports;
      this.detect();
    });
  }

  private listenToDeltaChanging(): void {
    this.select(selectReportingBuildsDelta, (delta: boolean) => {
      this.delta = delta;
      this.detect();
    });
  }

  onRowClick(report: Report): void {
    if (report !== this.activeReport) {
      this.router.navigate(['builds', report.number], { queryParamsHandling: 'merge' });
      this.dispatch(ReportingBuildsSetActiveReport, report);
    }
  }
}
