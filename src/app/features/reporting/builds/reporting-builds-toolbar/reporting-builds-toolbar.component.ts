import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ReportingBuildsGetReports, ReportingBuildsToggleDelta, ReportingBuildsToggleFilter } from '@reporting/builds/reporting-builds.actions';
import { selectReportingBuildsActiveFilters, selectReportingBuildsDelta } from '@reporting/builds/reporting-builds.state';

export const reportingIconMap = {
  pending: 'schedule',
  running: 'panorama_fish_eye',
  success: 'task_alt',
  failure: 'error',
  killed: 'do_not_disturb_on',
};

@Component({
  selector: 'mina-reporting-builds-toolbar',
  templateUrl: './reporting-builds-toolbar.component.html',
  styleUrls: ['./reporting-builds-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingBuildsToolbarComponent extends StoreDispatcher implements OnInit {

  readonly iconMap = reportingIconMap;

  @Output() onSizeChange: EventEmitter<void> = new EventEmitter<void>();

  activeFilters: string[] = [];
  availableFilters: string[] = ['pending', 'running', 'success', 'failure', 'killed'];
  filtersOpen: boolean;
  delta: boolean;

  private elementHeight: number;

  constructor(private elementRef: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanging();
    this.listenToDeltaChanging();
  }

  refetchReports(): void {
    this.dispatch(ReportingBuildsGetReports);
  }

  toggleFilerPanel(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  onResize(): void {
    if (this.elementHeight !== this.elementRef.nativeElement.offsetHeight) {
      this.elementHeight = this.elementRef.nativeElement.offsetHeight;
      this.onSizeChange.emit();
    }
  }

  toggleFilter(filter: string): void {
    const success = 'success';
    if (this.activeFilters.length === 1 && this.activeFilters[0] === success && filter === success) {
      return;
    }
    this.dispatch(ReportingBuildsToggleFilter, filter);
    if (this.activeFilters.length === 0) {
      this.dispatch(ReportingBuildsToggleFilter, success);
    }
  }

  private listenToFiltersChanging(): void {
    this.select(selectReportingBuildsActiveFilters, (activeFilters: string[]) => {
      this.activeFilters = activeFilters;
      this.detect();
    });
  }

  private listenToDeltaChanging(): void {
    this.select(selectReportingBuildsDelta, (delta: boolean) => {
      this.delta = delta;
      this.detect();
    });
  }

  toggleDelta(): void {
    this.dispatch(ReportingBuildsToggleDelta);
  }
}
