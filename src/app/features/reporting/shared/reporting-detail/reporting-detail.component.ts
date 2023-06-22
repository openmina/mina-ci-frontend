import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Report } from '@shared/types/reporting/report.type';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { CONFIG } from '@shared/constants/config';

@Component({
  selector: 'mina-reporting-detail',
  templateUrl: './reporting-detail.component.html',
  styleUrls: ['./reporting-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class ReportingDetailComponent implements OnChanges {

  @Input() activeReport: Report;
  @Input() blocks: ReportDetailBlock[] = [];
  @Input() nodesCounters: { [key: string]: number } = {};
  @Input() currentBlocksSort: TableSort<ReportDetailBlock>;
  @Input() currentPeerSort: TableSort<ReportDetailBlockPeerTiming>;
  @Input() activeBlock: ReportDetailBlock;
  @Input() graphConfig: ReportGraphConfig;
  @Input() compareBuild: boolean = true;

  @Output() changeBlock: EventEmitter<ReportDetailBlock> = new EventEmitter<ReportDetailBlock>();
  @Output() sortBlocks: EventEmitter<TableSort<ReportDetailBlock>> = new EventEmitter<TableSort<ReportDetailBlock>>();
  @Output() sortPeers: EventEmitter<TableSort<ReportDetailBlockPeerTiming>> = new EventEmitter<TableSort<ReportDetailBlockPeerTiming>>();

  activeStep: number = 1;
  readonly droneUrl: string = CONFIG.drone;

  @ViewChild('receiveLatenciesGraph', { read: ViewContainerRef }) private receiveLatenciesGraphRef: ViewContainerRef;
  @ViewChild('blockProductionGraph', { read: ViewContainerRef }) private blockProductionGraphRef: ViewContainerRef;
  @ViewChild('blockApplicationGraph', { read: ViewContainerRef }) private blockApplicationGraphRef: ViewContainerRef;

  private receiveLatenciesGraph: BarGraphComponent;
  private blockProductionGraph: BarGraphComponent;
  private blockApplicationGraph: BarGraphComponent;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['activeReport']?.previousValue !== changes['activeReport']?.currentValue) {
      if (this.activeStep === 3) {
        this.activeStep = 2;
      }
      if (!this.receiveLatenciesGraph) {
        await this.initGraphComponents();
      }

      this.blockProductionGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointProduction, 10)];
      this.blockProductionGraph.values = this.activeReport.productionTimes;
      this.blockProductionGraph.update();
      this.blockProductionGraph.detect();

      this.blockApplicationGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointApplication, 10)];
      this.blockApplicationGraph.values = this.activeReport.applicationTimes;
      this.blockApplicationGraph.update();
      this.blockApplicationGraph.detect();

      this.receiveLatenciesGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointLatency, 10)];
      this.receiveLatenciesGraph.values = this.activeReport.receiveLatencies;
      this.receiveLatenciesGraph.update();
      this.receiveLatenciesGraph.detect();
    }
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
      this.receiveLatenciesGraph.decimals = 0;
      this.receiveLatenciesGraph.responsive = false;
      this.receiveLatenciesGraph.color = 'var(--special-selected-alt-1-primary)';
      this.receiveLatenciesGraph.xTicksSkipper = 5;
      this.receiveLatenciesGraph.domainValues = [0, Math.max(this.graphConfig.graphMaxPointLatency, 10)];
      this.receiveLatenciesGraph.ngOnInit();
    });
  }

  updateStep(step: number): void {
    this.activeStep = step;
  }
}
