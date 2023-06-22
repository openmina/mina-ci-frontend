import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Report } from '@shared/types/reporting/report.type';
import { selectReportingCompareAllReports, selectReportingCompareGraphConfig, selectReportingCompareReports } from '@reporting/compare/reporting-compare.state';
import { ReportGraphConfig } from '@shared/types/reporting/report-graph-config.type';
import { ReportingGraphComponent } from '@reporting/shared/reporting-graph/reporting-graph.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ReportingCompareGetCompareReports } from '@reporting/compare/reporting-compare.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CONFIG } from '@shared/constants/config';

@Component({
  selector: 'mina-reporting-compare-first-section',
  templateUrl: './reporting-compare-first-section.component.html',
  styleUrls: ['./reporting-compare-first-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-12 flex-column overflow-y-auto no-transition' },
  animations: [
    trigger('popupAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)',
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
      })),
      transition('hidden => visible', [
        animate('0.2s ease-in-out'),
      ]),
      transition('visible => hidden', [
        animate('0.2s ease-in-out'),
      ]),
    ]),
  ],
})
export class ReportingCompareFirstSectionComponent extends StoreDispatcher implements OnInit {

  readonly droneUrl: string = CONFIG.drone;

  first: Report;
  second: Report;
  config: ReportGraphConfig;
  allReports: Report[];
  firstOpened: boolean;
  dropdownVisible = false;

  @ViewChildren(ReportingGraphComponent) public graphs: ReportingGraphComponent[];

  @ViewChild('dropdown') private drTemplate: TemplateRef<void>;
  @ViewChildren('dropdownTrigger') private dropdownTriggers: QueryList<ElementRef<HTMLDivElement>>;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { super(); }

  ngOnInit(): void {
    this.listenToReportsChanges();
    this.listenToGraphConfigChanges();
  }

  private listenToReportsChanges(): void {
    this.select(selectReportingCompareReports, (reports: [Report, Report]) => {
      this.first = reports[0];
      this.second = reports[1];
      this.detect();
    });
    this.select(selectReportingCompareAllReports, (reports: Report[]) => {
      this.allReports = reports;
    });
  }

  private listenToGraphConfigChanges(): void {
    this.select(selectReportingCompareGraphConfig, (config: ReportGraphConfig) => {
      this.config = config;
      this.detect();
    });
  }

  openDropdown(event: MouseEvent, name: 'first' | 'second'): void {
    if (this.overlayRef?.hasAttached()) {
      this.detachOverlay();
      return;
    }
    this.firstOpened = name === 'first';

    const origin = this.dropdownTriggers.get(name === 'first' ? 0 : 1).nativeElement;
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(origin)
        .withPositions([{
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 50,
        }]),
    });
    event.stopPropagation();

    const portal = new TemplatePortal(this.drTemplate, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.dropdownVisible = true;
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.dropdownVisible = false;
      setTimeout(() => this.overlayRef.detach(), 200);
    }
  }

  selectReport(report: Report): void {
    const reports: [number, number] = [this.first.number, this.second.number];
    reports[this.firstOpened ? 0 : 1] = report.number;
    this.dispatch(ReportingCompareGetCompareReports, reports);
    this.detachOverlay();
  }
}
