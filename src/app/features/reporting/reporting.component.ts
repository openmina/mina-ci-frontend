import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ReportingClose, ReportingGetReports, ReportingMarkReportToShow, ReportingSetActiveReport } from '@reporting/reporting.actions';
import { ReportingTableComponent } from '@reporting/reporting-table/reporting-table.component';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { selectReportingActiveReport } from '@reporting/reporting.state';
import { Report } from '@shared/types/reporting/report.type';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';

@Component({
  selector: 'mina-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(ReportingTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.dispatch(ReportingGetReports);
    this.listenToRouteChange();
    this.listenToActiveRowChange();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.select(selectReportingActiveReport, (row: Report) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      this.dispatch(ReportingMarkReportToShow, Number(route.params['id']));
    }, take(1), filter((route: MergedRoute) => !!route.params['id']));
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ReportingClose);
  }
}
