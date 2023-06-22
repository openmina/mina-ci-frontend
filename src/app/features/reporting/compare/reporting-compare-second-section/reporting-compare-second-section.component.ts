import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Report } from '@shared/types/reporting/report.type';
import { filter, map } from 'rxjs';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import {
  selectReportingCompareBlockSort,
  selectReportingCompareFirstActiveBlock,
  selectReportingCompareFirstReportDetailBlocks,
  selectReportingCompareGraphConfig,
  selectReportingComparePeerSort,
  selectReportingCompareReports,
} from '@reporting/compare/reporting-compare.state';
import { ReportingCompareBlocksSort, ReportingComparePeersSort, ReportingCompareSelectFirstBlock } from '@reporting/compare/reporting-compare.actions';

@Component({
  selector: 'mina-reporting-compare-second-section',
  templateUrl: './reporting-compare-second-section.component.html',
  styleUrls: ['./reporting-compare-second-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column no-transition' },
})
export class ReportingCompareSecondSectionComponent extends StoreDispatcher implements OnInit {

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
    this.dispatch(ReportingCompareSelectFirstBlock, block);
  }

  private listenToActiveReport(): void {
    this.select(selectReportingCompareReports, (report: Report) => {
      this.activeReport = report;
      this.detect();
    }, map(reports => reports[0]), filter(Boolean));
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingCompareFirstReportDetailBlocks, (blocks: ReportDetailBlock[]) => {
      this.blocks = blocks || [];
      if (blocks && blocks[0]) {
        this.nodesCounters['nodes'] = blocks[0].peerTimings.filter(p => p.node.includes('node')).length;
        this.nodesCounters['snarkers'] = blocks[0].peerTimings.filter(p => p.node.includes('snarker')).length;
        this.nodesCounters['producers'] = blocks[0].peerTimings.filter(p => p.node.includes('prod')).length;
      } else {
        this.nodesCounters['nodes'] = 0;
        this.nodesCounters['snarkers'] = 0;
        this.nodesCounters['producers'] = 0;
      }
      this.detect();
    });
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
    this.select(selectReportingCompareFirstActiveBlock, (block: ReportDetailBlock) => {
      this.activeBlock = block;
      this.detect();
    });
  }
}
