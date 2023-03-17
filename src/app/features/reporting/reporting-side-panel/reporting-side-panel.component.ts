import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Report } from '@shared/types/reporting/report.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectReportingActiveReport, selectReportingActiveReportDetail, selectReportingGraphConfig } from '@reporting/reporting.state';
import { ReportingSelectBlock, ReportingSetActiveReport } from '@reporting/reporting.actions';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { Router } from '@angular/router';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { filter } from 'rxjs';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';

@Component({
  selector: 'mina-reporting-side-panel',
  templateUrl: './reporting-side-panel.component.html',
  styleUrls: ['./reporting-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column' },
})
export class ReportingSidePanelComponent extends StoreDispatcher implements OnInit, AfterViewInit {

  activeReport: Report;
  activeReportDetail: ReportDetail;
  activeStep: number = 1;

  @ViewChild('receiveLatenciesGraph', { read: ViewContainerRef })
  private receiveLatenciesGraphRef: ViewContainerRef;
  @ViewChild('blockProductionGraph', { read: ViewContainerRef })
  private blockProductionGraphRef: ViewContainerRef;
  @ViewChild('blockApplicationGraph', { read: ViewContainerRef })
  private blockApplicationGraphRef: ViewContainerRef;

  private receiveLatenciesGraph: BarGraphComponent;
  private blockProductionGraph: BarGraphComponent;
  private blockApplicationGraph: BarGraphComponent;

  private graphConfig: ReportGraphConfig;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.buildGraph();
    // }, 100);
    this.listenToGraphConfigChange();
  }

  ngAfterViewInit(): void {
    this.listenToActiveReport();
    this.getActiveReportDetail();
  }

  private async initGraphComponents(): Promise<void> {
    return await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.blockProductionGraph = this.blockProductionGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.blockProductionGraph.xStep = 1;
      this.blockProductionGraph.xTicksLength = 50;
      this.blockProductionGraph.yTicksLength = 5;
      this.blockProductionGraph.um = 's';
      this.blockProductionGraph.yAxisLabel = 'Count';
      this.blockProductionGraph.decimals = 0;
      this.blockProductionGraph.responsive = false;
      this.blockProductionGraph.color = 'var(--special-selected-alt-2-primary)';
      this.blockProductionGraph.xTicksSkipper = 5;
      this.blockProductionGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointProduction, 10)];
      this.blockProductionGraph.ngOnInit();

      this.blockApplicationGraph = this.blockApplicationGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.blockApplicationGraph.xStep = 1;
      this.blockApplicationGraph.xTicksLength = 50;
      this.blockApplicationGraph.yTicksLength = 5;
      this.blockApplicationGraph.um = 's';
      this.blockApplicationGraph.yAxisLabel = 'Count';
      this.blockApplicationGraph.decimals = 0;
      this.blockApplicationGraph.responsive = false;
      this.blockApplicationGraph.color = 'var(--special-selected-alt-3-primary)';
      this.blockApplicationGraph.xTicksSkipper = 5;
      this.blockApplicationGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointApplication, 10)];
      this.blockApplicationGraph.ngOnInit();

      this.receiveLatenciesGraph = this.receiveLatenciesGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.receiveLatenciesGraph.xStep = 1;
      this.receiveLatenciesGraph.xTicksLength = 50;
      this.receiveLatenciesGraph.yTicksLength = 5;
      this.receiveLatenciesGraph.um = 's';
      this.receiveLatenciesGraph.yAxisLabel = 'Count';
      this.receiveLatenciesGraph.decimals = 1;
      this.receiveLatenciesGraph.responsive = false;
      this.receiveLatenciesGraph.color = 'var(--special-selected-alt-1-primary)';
      this.receiveLatenciesGraph.xTicksSkipper = 5;
      this.receiveLatenciesGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointLatency, 10)];
      this.receiveLatenciesGraph.ngOnInit();
    });
  }

  private listenToActiveReport(): void {
    this.select(selectReportingActiveReport, async (report: Report) => {
      this.activeReport = report;
      this.detect();

      if (!this.receiveLatenciesGraph) {
        await this.initGraphComponents();
      }

      this.blockProductionGraph.values = report.productionTimes;
      this.blockProductionGraph.update();
      this.blockProductionGraph.detect();

      this.blockApplicationGraph.values = report.applicationTimes;
      this.blockApplicationGraph.update();
      this.blockApplicationGraph.detect();

      this.receiveLatenciesGraph.values = report.receiveLatencies;
      this.receiveLatenciesGraph.update();
      this.receiveLatenciesGraph.detect();
    }, filter(Boolean));
  }

  private listenToGraphConfigChange(): void {
    this.select(selectReportingGraphConfig, (config: ReportGraphConfig) => {
      this.graphConfig = config;
    });
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingActiveReportDetail, (detail: ReportDetail) => {
      this.activeReportDetail = detail;
      const maxTime = Math.max(...detail.blocks.map(block => block.maxReceiveLatency));
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(ReportingSetActiveReport, undefined);
    this.router.navigate(['']);
  }

  updateStep(step: number): void {
    this.activeStep = step;
  }
}
