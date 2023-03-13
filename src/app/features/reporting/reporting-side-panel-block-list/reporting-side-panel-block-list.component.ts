import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { selectReportingActiveReportDetail, selectReportingSort } from '@reporting/reporting.state';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { ReportingBlocksSort, ReportingSelectBlock } from '@reporting/reporting.actions';

@Component({
  selector: 'mina-reporting-side-panel-block-list',
  templateUrl: './reporting-side-panel-block-list.component.html',
  styleUrls: ['./reporting-side-panel-block-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-minus-lg flex-column' },
})
export class ReportingSidePanelBlockListComponent extends StoreDispatcher implements OnInit {

  @Output() closeStep2: EventEmitter<void> = new EventEmitter<void>();

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ReportDetailBlock>[] = [
    { name: 'height' },
    { name: 'gl. slot', sort: 'globalSlot' },
    { name: 'hash', sort: 'blockHash' },
    { name: 'tx', sort: 'transactions' },
    { name: 'max lat.', sort: 'maxReceiveLatency' },
    { name: 'prod nodes', sort: 'blockProducerNodesLength' },
  ];

  blocks: ReportDetailBlock[] = [];
  currentSort: TableSort<ReportDetailBlock>;

  constructor() { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToBlocks();
  }

  private listenToBlocks(): void {
    this.select(selectReportingActiveReportDetail, (detailBlock: ReportDetail) => {
      this.blocks = detailBlock.blocks;
      this.detect();
    });
  }

  private listenToSortingChanges(): void {
    this.select(selectReportingSort, sort => {
      this.currentSort = sort;
      this.detect();
    });
  }

  onRowClick(block: ReportDetailBlock): void {
    this.closeStep2.emit();
    this.dispatch(ReportingSelectBlock, block);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(ReportingBlocksSort, { sortBy: sortBy as keyof ReportDetailBlock, sortDirection });
  }
}
