import { ChangeDetectionStrategy, Component, OnInit, ViewChildren } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectReportingDashboardActiveReport, selectReportingDashboardReports } from '@reporting/dashboard/reporting-dashboard.state';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDashboardGraphPoint } from '@app/shared/types/reporting/report-dashboard-graph-point.type';
import { ReportingDashboardSetActiveReport } from '@reporting/dashboard/reporting-dashboard.actions';
import { ReportingDashboardGraphComponent } from '@reporting/dashboard/reporting-dashboard-graph/reporting-dashboard-graph.component';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';

type ActiveReportType = 'production' | 'application' | 'latency';

@Component({
  selector: 'mina-reporting-dashboard-graph-list',
  templateUrl: './reporting-dashboard-graph-list.component.html',
  styleUrls: ['./reporting-dashboard-graph-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column p-12 overflow-y-auto overflow-x-hidden no-transition' },
})
export class ReportingDashboardGraphListComponent extends StoreDispatcher implements OnInit {

  reports: Report[];
  productionTimes: ReportDashboardGraphPoint[] = [];
  applicationTimes: ReportDashboardGraphPoint[] = [];
  latencyTimes: ReportDashboardGraphPoint[] = [];
  activeReportType: ActiveReportType;
  showBarInGraph: ActiveReportType;
  idFromRoute: number;
  isWeekly: boolean = true;

  private activeReport: Report;

  @ViewChildren(ReportingDashboardGraphComponent) public graphs: ReportingDashboardGraphComponent[];

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToReportingDashboardReports();
    this.listenToActivePointChange();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      this.idFromRoute = route.params['id'];
    }, take(1));
  }

  private listenToReportingDashboardReports(): void {
    this.select(selectReportingDashboardReports, (reports: Report[]) => {
      this.reports = reports;
      this.productionTimes = this.useOneReportPerWeek(reports, 'blockProduction');
      this.applicationTimes = this.useOneReportPerWeek(reports, 'blockApplication');
      this.latencyTimes = this.useOneReportPerWeek(reports, 'latency');
      if (this.idFromRoute && reports.length) {
        const reportFromRoute = reports.find(r => r.number == this.idFromRoute);
        this.showBarInGraph = this.getTypeOfSelectedGraph(reportFromRoute);
        this.activeReportType = this.showBarInGraph;
        delete this.idFromRoute;
      }
      this.detect();
    });
  }

  private listenToActivePointChange(): void {
    this.select(selectReportingDashboardActiveReport, (report: Report) => {
      if (!report && this.activeReport) {
        this.activeReportType = undefined;
        this.detect();
      }
      this.activeReport = report;
    });
  }

  private getTypeOfSelectedGraph(report: Report): ActiveReportType {
    return this.productionTimes.some(p => p.number === report.number)
      ? 'production'
      : this.applicationTimes.some(p => p.number === report.number)
        ? 'application'
        : 'latency';
  }

  setActivePoint(point: ReportDashboardGraphPoint, type: ActiveReportType): void {
    this.activeReportType = type;
    const report = this.reports.find(r => r.timestamp === point.timestamp);
    if (!report) {
      return;
    }
    this.dispatch(ReportingDashboardSetActiveReport, report);
    this.router.navigate(['trends', report.number]);
  }

  showWeekly(): void {
    if (this.isWeekly) {
      return;
    }
    this.isWeekly = true;
    this.productionTimes = this.useOneReportPerWeek(this.reports, 'blockProduction');
    this.applicationTimes = this.useOneReportPerWeek(this.reports, 'blockApplication');
    this.latencyTimes = this.useOneReportPerWeek(this.reports, 'latency');
  }

  showMonthly(): void {
    if (!this.isWeekly) {
      return;
    }
    this.isWeekly = false;
    this.productionTimes = this.useOneReportPerMonth(this.reports, 'blockProduction');
    this.applicationTimes = this.useOneReportPerMonth(this.reports, 'blockApplication');
    this.latencyTimes = this.useOneReportPerMonth(this.reports, 'latency');
  }

  private useOneReportPerMonth(reports: Report[], prop: string): ReportDashboardGraphPoint[] {
    const arr: number[] = Array(12).fill(0).map((_, i) => i);
    const currentMonth: number = new Date().getMonth(); // get current month as a number from 0 to 11

    const monthsInOrder = arr.slice(currentMonth + 1).concat(arr.slice(0, currentMonth + 1));
    const group = monthsInOrder.reduce((acc, obj) => {
      acc[obj] = [];
      return acc;
    }, {});
    const groupedByMonth = reports.reduce((acc, obj: Report) => {
      const date = new Date(obj.timestamp);
      const month = date.getMonth();
      acc[month].push(obj);
      return acc;
    }, group);
    return Array.from({ length: 12 }, (_, i) => {
      const month = monthsInOrder[i];
      const report = groupedByMonth[month].reduce((prev: Report, current: Report) => {
        return (prev[prop + 'Max'] > current[prop + 'Max']) ? prev : current;
      }, {});
      if (Object.keys(report).length === 0) {
        return { avg: 0, max: 0, month, index: i, timestamp: undefined, number: undefined, week: undefined };
      } else {
        return {
          avg: report[prop + 'Avg'],
          max: report[prop + 'Max'],
          month,
          number: report.number,
          index: i,
          week: undefined,
          timestamp: report.timestamp,
        };
      }
    });
  }

  private useOneReportPerWeek(reports: Report[], prop: string): ReportDashboardGraphPoint[] {
    const arr: number[] = Array(48).fill(0).map((_, i) => i);
    const currentDate: Date = new Date();

    const weeksInOrder = arr.slice(0, 48).reverse();
    const group = weeksInOrder.reduce((acc, obj) => {
      acc[obj] = [];
      return acc;
    }, {});
    const groupedByWeek = reports.reduce((acc, obj: Report) => {
      const date = new Date(obj.timestamp);
      const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
      const week = Math.floor(timeDiff / (1000 * 3600 * 24 * 7));
      acc[week].push(obj);
      return acc;
    }, group);
    return Array.from({ length: 48 }, (_, i) => {
      const week = weeksInOrder[i];
      const report = groupedByWeek[week].reduce((prev: Report, current: Report) => {
        return (prev[prop + 'Max'] > current[prop + 'Max']) ? prev : current;
      }, {});
      if (Object.keys(report).length === 0) {
        return { avg: 0, max: 0, month: undefined, index: i, timestamp: undefined, number: undefined, week };
      } else {
        return {
          avg: report[prop + 'Avg'],
          max: report[prop + 'Max'],
          month: undefined,
          number: report.number,
          index: i,
          week,
          timestamp: report.timestamp,
        };
      }
    });
  }
}
