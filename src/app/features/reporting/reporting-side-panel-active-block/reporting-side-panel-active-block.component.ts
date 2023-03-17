import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectReportingActiveBlock, selectReportingPeerSort } from '@reporting/reporting.state';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ReportingPeersSort } from '@reporting/reporting.actions';

@Component({
  selector: 'mina-reporting-side-panel-active-block',
  templateUrl: './reporting-side-panel-active-block.component.html',
  styleUrls: ['./reporting-side-panel-active-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ReportingSidePanelActiveBlockComponent extends StoreDispatcher implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ReportDetailBlockPeerTiming>[] = [
    { name: 'node' },
    { name: 'block processing', sort: 'blockProcessingTime' },
    { name: 'block broadcast', sort: 'receiveLatency' },
  ];

  @Output() closeStep3: EventEmitter<void> = new EventEmitter<void>();

  block: ReportDetailBlock;
  selectedTabIndex: number = 0;
  currentSort: TableSort<ReportDetailBlockPeerTiming>;

  ngOnInit(): void {
    this.listenToActiveBlockChange();
    this.listenToSortingChanges();
  }

  private listenToActiveBlockChange(): void {
    this.select(selectReportingActiveBlock, (block: ReportDetailBlock) => {
      this.block = block;
      this.detect();
    });
  }

  private listenToSortingChanges(): void {
    this.select(selectReportingPeerSort, sort => {
      this.currentSort = sort;
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(ReportingPeersSort, { sortBy: sortBy as keyof ReportDetailBlockPeerTiming, sortDirection });
  }

  onClose(): void {
    this.closeStep3.emit();
  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }
}
