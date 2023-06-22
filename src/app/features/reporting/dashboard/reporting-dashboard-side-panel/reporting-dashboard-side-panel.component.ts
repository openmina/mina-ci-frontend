import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { Router } from '@angular/router';
import { ReportingBuildsSetActiveReport } from '@reporting/builds/reporting-builds.actions';
import { filter } from 'rxjs';
import {
  selectReportingDashboardActiveBlock,
  selectReportingDashboardActiveReport,
  selectReportingDashboardActiveReportDetailBlocks,
  selectReportingDashboardBlockSort,
  selectReportingDashboardGraphConfig,
  selectReportingDashboardPeerSort,
} from '@reporting/dashboard/reporting-dashboard.state';
import {
  ReportingDashboardBlocksSort,
  ReportingDashboardPeersSort,
  ReportingDashboardSelectBlock,
  ReportingDashboardSetActiveReport,
} from '@reporting/dashboard/reporting-dashboard.actions';

@Component({
  selector: 'mina-reporting-dashboard-side-panel',
  templateUrl: './reporting-dashboard-side-panel.component.html',
  styleUrls: ['./reporting-dashboard-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class ReportingDashboardSidePanelComponent extends StoreDispatcher implements OnInit {

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
    this.dispatch(ReportingDashboardSetActiveReport, undefined);
    this.router.navigate(['trends']);
  }

  sortBlocksTable(sort: TableSort<ReportDetailBlock>): void {
    this.dispatch(ReportingDashboardBlocksSort, sort);
  }

  sortPeersTable(sort: TableSort<ReportDetailBlockPeerTiming>): void {
    this.dispatch(ReportingDashboardPeersSort, sort);
  }

  changeActiveBlock(block: ReportDetailBlock): void {
    this.dispatch(ReportingDashboardSelectBlock, block);
  }

  private listenToActiveReport(): void {
    this.select(selectReportingDashboardActiveReport, (report: Report) => {
      this.activeReport = report;
      this.detect();
    }, filter(Boolean));
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingDashboardActiveReportDetailBlocks, (blocks: ReportDetailBlock[]) => {
      this.blocks = blocks;
      this.nodesCounters['nodes'] = blocks[0]?.peerTimings.filter(p => p.node.includes('node')).length || 0;
      this.nodesCounters['snarkers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('snarker')).length || 0;
      this.nodesCounters['producers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('prod')).length || 0;
      this.detect();
    });
  }

  private listenToGraphConfigChanges(): void {
    this.select(selectReportingDashboardGraphConfig, (config: ReportGraphConfig) => {
      this.graphConfig = config;
    });
  }

  private listenToBlockSortChanges(): void {
    this.select(selectReportingDashboardBlockSort, (sort: TableSort<ReportDetailBlock>) => {
      this.currentBlocksSort = sort;
      this.detect();
    });
  }

  private listenToPeerSortChanges(): void {
    this.select(selectReportingDashboardPeerSort, sort => {
      this.currentPeerSort = sort;
      this.detect();
    });
  }

  private listenToActiveBlockChanges(): void {
    this.select(selectReportingDashboardActiveBlock, (block: ReportDetailBlock) => {
      this.activeBlock = block;
      this.detect();
    });
  }
}
