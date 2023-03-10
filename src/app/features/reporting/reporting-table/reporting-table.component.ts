import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Router } from '@angular/router';
import { selectActiveReport, selectReports } from '@reporting/reporting.state';
import { Report } from '@shared/types/reporting/report.type';
import { ReportingSetActiveReport } from '@reporting/reporting.actions';

@Component({
  selector: 'mina-reporting-table',
  templateUrl: './reporting-table.component.html',
  styleUrls: ['./reporting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class ReportingTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 72;

  reports: Report[];
  activeReport: Report;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.listenToReportsChange();
  }

  private listenToActiveRowChange(): void {
    this.select(selectActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    });
  }

  private listenToReportsChange(): void {
    this.select(selectReports, (reports: Report[]) => {
      this.reports = reports;
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
