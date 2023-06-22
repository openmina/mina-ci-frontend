import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import {
  ReportingBuildsBlocksSort,
  ReportingBuildsPeersSort,
  ReportingBuildsSelectBlock,
  ReportingBuildsSetActiveReport,
} from '@reporting/builds/reporting-builds.actions';
import { Router } from '@angular/router';
import {
  selectReportingBuildsActiveBlock,
  selectReportingBuildsActiveReport,
  selectReportingBuildsActiveReportDetailBlocks, selectReportingBuildsBlockSort,
  selectReportingBuildsGraphConfig, selectReportingBuildsPeerSort,
} from '@reporting/builds/reporting-builds.state';
import { Report } from '@shared/types/reporting/report.type';
import { filter } from 'rxjs';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

@Component({
  selector: 'mina-reporting-builds-side-panel',
  templateUrl: './reporting-builds-side-panel.component.html',
  styleUrls: ['./reporting-builds-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column' },
})
export class ReportingBuildsSidePanelComponent extends StoreDispatcher implements OnInit {

  activeReport: Report;
  blocks: ReportDetailBlock[] = [];
  nodesCounters: { [key: string]: number } = {};
  graphConfig: ReportGraphConfig;
  currentBlocksSort: TableSort<ReportDetailBlock>;
  currentPeerSort: TableSort<ReportDetailBlockPeerTiming>;
  activeBlock: ReportDetailBlock;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToGraphConfigChanges();
    this.listenToActiveReport();
    this.getActiveReportDetail();
    this.listenToBlockSortChanges();
    this.listenToPeerSortChanges();
    this.listenToActiveBlockChanges();
  }

  closeSidePanel(): void {
    this.dispatch(ReportingBuildsSetActiveReport, undefined);
    this.router.navigate(['builds']);
  }

  sortBlocksTable(sort: TableSort<ReportDetailBlock>): void {
    this.dispatch(ReportingBuildsBlocksSort, sort);
  }

  sortPeersTable(sort: TableSort<ReportDetailBlockPeerTiming>): void {
    this.dispatch(ReportingBuildsPeersSort, sort);
  }

  changeActiveBlock(block: ReportDetailBlock): void {
    this.dispatch(ReportingBuildsSelectBlock, block);
  }

  private listenToActiveReport(): void {
    this.select(selectReportingBuildsActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    }, filter(Boolean));
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingBuildsActiveReportDetailBlocks, (blocks: ReportDetailBlock[]) => {
      this.blocks = blocks;
      this.nodesCounters['nodes'] = blocks[0]?.peerTimings.filter(p => p.node.includes('node')).length || 0;
      this.nodesCounters['snarkers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('snarker')).length || 0;
      this.nodesCounters['producers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('prod')).length || 0;
      this.detect();
    });
  }

  private listenToGraphConfigChanges(): void {
    this.select(selectReportingBuildsGraphConfig, (config: ReportGraphConfig) => {
      this.graphConfig = config;
    });
  }

  private listenToBlockSortChanges(): void {
    this.select(selectReportingBuildsBlockSort, (sort: TableSort<ReportDetailBlock>) => {
      this.currentBlocksSort = sort;
      this.detect();
    });
  }

  private listenToPeerSortChanges(): void {
    this.select(selectReportingBuildsPeerSort, sort => {
      this.currentPeerSort = sort;
      this.detect();
    });
  }

  private listenToActiveBlockChanges(): void {
    this.select(selectReportingBuildsActiveBlock, (block: ReportDetailBlock) => {
      this.activeBlock = block;
      this.detect();
    });
  }
}
