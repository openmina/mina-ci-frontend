import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';

@Component({
  selector: 'mina-reporting-detail-block-list',
  templateUrl: './reporting-detail-block-list.component.html',
  styleUrls: ['./reporting-detail-block-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-minus-lg flex-column' },
})
export class ReportingDetailBlockListComponent {

  @Input() blocks: ReportDetailBlock[] = [];
  @Input() currentSort: TableSort<ReportDetailBlock>;

  @Output() closeStep2: EventEmitter<void> = new EventEmitter<void>();
  @Output() sortBlocks: EventEmitter<TableSort<ReportDetailBlock>> = new EventEmitter<TableSort<ReportDetailBlock>>();
  @Output() changeBlock: EventEmitter<ReportDetailBlock> = new EventEmitter<ReportDetailBlock>();

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

  onRowClick(block: ReportDetailBlock): void {
    this.closeStep2.emit();
    this.changeBlock.emit(block);
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.sortBlocks.emit({ sortBy: sortBy as keyof ReportDetailBlock, sortDirection });
  }
}
