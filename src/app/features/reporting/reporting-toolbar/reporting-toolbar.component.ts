import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectReportingActiveFilters, selectReportingDelta } from '@reporting/reporting.state';
import { ReportingToggleDelta, ReportingToggleFilter } from '@reporting/reporting.actions';

export const reportingIconMap = {
  pending: 'schedule',
  running: 'panorama_fish_eye',
  success: 'task_alt',
  failure: 'error',
  killed: 'do_not_disturb_on',
};

@Component({
  selector: 'mina-reporting-toolbar',
  templateUrl: './reporting-toolbar.component.html',
  styleUrls: ['./reporting-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingToolbarComponent extends StoreDispatcher implements OnInit {

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
    this.dispatch(ReportingToggleFilter, filter);
  }

  private listenToFiltersChanging(): void {
    this.select(selectReportingActiveFilters, (activeFilters: string[]) => {
      this.activeFilters = activeFilters;
      this.detect();
    });
  }

  private listenToDeltaChanging(): void {
    this.select(selectReportingDelta, (delta: boolean) => {
      this.delta = delta;
      this.detect();
    });
  }

  toggleDelta(): void {
    this.dispatch(ReportingToggleDelta);
  }
}
