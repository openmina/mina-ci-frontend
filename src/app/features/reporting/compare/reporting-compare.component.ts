import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ReportingCompareClose, ReportingCompareGetReports } from '@reporting/compare/reporting-compare.actions';
import { ReportingCompareFirstSectionComponent } from '@reporting/compare/reporting-compare-first-section/reporting-compare-first-section.component';
import { ReportingCompareSecondSectionComponent } from './reporting-compare-second-section/reporting-compare-second-section.component';
import { ReportingGraphComponent } from '@reporting/shared/reporting-graph/reporting-graph.component';
import { ReportingCompareThirdSectionComponent } from '@reporting/compare/reporting-compare-third-section/reporting-compare-third-section.component';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { ReportingBuildsMarkReportToShow } from '@reporting/builds/reporting-builds.actions';
import { filter, take } from 'rxjs';

@Component({
  selector: 'mina-reporting-compare',
  templateUrl: './reporting-compare.component.html',
  styleUrls: ['./reporting-compare.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingCompareComponent extends StoreDispatcher implements OnInit, OnDestroy {

  minWidth1: number = 600;
  maxWidth2: number;

  @ViewChild(ReportingCompareFirstSectionComponent, { read: ElementRef }) private firstComponent: ElementRef<HTMLElement>;
  @ViewChild(ReportingCompareSecondSectionComponent, { read: ElementRef }) private secondComponent: ElementRef<HTMLElement>;
  @ViewChild(ReportingCompareThirdSectionComponent, { read: ElementRef }) private thirdComponent: ElementRef<HTMLElement>;
  @ViewChild('firstResizeContainer', { read: ElementRef }) private firstHorizontalResizableContainer: ElementRef<HTMLElement>;
  @ViewChild('secondResizeContainer', { read: ElementRef }) private secondHorizontalResizableContainer: ElementRef<HTMLElement>;
  @ViewChild(ReportingCompareFirstSectionComponent) private firstSection: ReportingCompareFirstSectionComponent;
  @ViewChild('parent2', { read: ElementRef }) private parent2: ElementRef<HTMLElement>;

  ngOnInit(): void {
    localStorage.setItem('reporting-compare-first', localStorage.getItem('reporting-compare-first') || (window.innerWidth / 3 * 2).toString());
    localStorage.setItem('reporting-compare-second', localStorage.getItem('reporting-compare-second') || (window.innerWidth / 3).toString());
    this.listenToRouteChange()
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      const compareId = isNaN(Number(route.queryParams['compare'])) ? null : Number(route.queryParams['compare']);
      const withId = isNaN(Number(route.queryParams['with'])) ? null : Number(route.queryParams['with']);
      this.dispatch(ReportingCompareGetReports, [compareId, withId]);
    }, take(1));
  }

  onWidthChange1(width: number): void {
    this.firstHorizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.firstComponent.nativeElement.style.width = `calc(100% - ${width}px)`;
    this.maxWidth2 = this.parent2.nativeElement.offsetWidth - 300;
    this.detect();
    this.firstSection.graphs.forEach((graph: ReportingGraphComponent) => {
      graph.redraw();
    });
  }

  onWidthChange2(width: number): void {
    this.secondHorizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.secondComponent.nativeElement.style.width = `calc(100% - ${width}px)`;
    this.minWidth1 = this.thirdComponent.nativeElement.offsetWidth + 300;
    this.detect();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ReportingCompareClose);
  }
}
