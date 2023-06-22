import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Report } from '@shared/types/reporting/report.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { ReportingCompareBlocksSort, ReportingComparePeersSort, ReportingCompareSelectSecondBlock } from '@reporting/compare/reporting-compare.actions';
import {
  selectReportingCompareBlockSort,
  selectReportingCompareGraphConfig,
  selectReportingComparePeerSort,
  selectReportingCompareReports,
  selectReportingCompareSecondActiveBlock,
  selectReportingCompareSecondReportDetailBlocks,
} from '@reporting/compare/reporting-compare.state';
import { filter, map } from 'rxjs';

@Component({
  selector: 'mina-reporting-compare-third-section',
  templateUrl: './reporting-compare-third-section.component.html',
  styleUrls: ['./reporting-compare-third-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100 border-left flex-column' },
})
export class ReportingCompareThirdSectionComponent extends StoreDispatcher implements OnInit {

  activeReport: Report;
  blocks: ReportDetailBlock[] = [];
  nodesCounters: { [key: string]: number } = {};
  graphConfig: ReportGraphConfig;
  currentBlocksSort: TableSort<ReportDetailBlock>;
  currentPeerSort: TableSort<ReportDetailBlockPeerTiming>;
  activeBlock: ReportDetailBlock;

  ngOnInit(): void {
    this.listenToGraphConfigChanges();
    this.listenToActiveReport();
    this.getActiveReportDetail();
    this.listenToBlockSortChanges();
    this.listenToPeerSortChanges();
    this.listenToActiveBlockChanges();
  }

  sortBlocksTable(sort: TableSort<ReportDetailBlock>): void {
    this.dispatch(ReportingCompareBlocksSort, sort);
  }

  sortPeersTable(sort: TableSort<ReportDetailBlockPeerTiming>): void {
    this.dispatch(ReportingComparePeersSort, sort);
  }

  changeActiveBlock(block: ReportDetailBlock): void {
    this.dispatch(ReportingCompareSelectSecondBlock, block);
  }

  private listenToActiveReport(): void {
    this.select(selectReportingCompareReports, (report: Report) => {
      this.activeReport = report;
      this.detect();
    }, map(reports => reports[1]), filter(Boolean));
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingCompareSecondReportDetailBlocks, (blocks: ReportDetailBlock[]) => {
      this.blocks = blocks;
      this.nodesCounters['nodes'] = blocks[0]?.peerTimings.filter(p => p.node.includes('node')).length || 0;
      this.nodesCounters['snarkers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('snarker')).length || 0;
      this.nodesCounters['producers'] = blocks[0]?.peerTimings.filter(p => p.node.includes('prod')).length || 0;
      this.detect();
    }, filter(b => b?.length > 0));
  }

  private listenToGraphConfigChanges(): void {
    this.select(selectReportingCompareGraphConfig, (config: ReportGraphConfig) => {
      this.graphConfig = config;
    });
  }

  private listenToBlockSortChanges(): void {
    this.select(selectReportingCompareBlockSort, (sort: TableSort<ReportDetailBlock>) => {
      this.currentBlocksSort = sort;
      this.detect();
    });
  }

  private listenToPeerSortChanges(): void {
    this.select(selectReportingComparePeerSort, sort => {
      this.currentPeerSort = sort;
      this.detect();
    });
  }

  private listenToActiveBlockChanges(): void {
    this.select(selectReportingCompareSecondActiveBlock, (block: ReportDetailBlock) => {
      this.activeBlock = block;
      this.detect();
    });
  }
}
