import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@Component({
  selector: 'mina-reporting-table-graph',
  templateUrl: './reporting-table-graph.component.html',
  styleUrls: ['./reporting-table-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingTableGraphComponent extends ManualDetection implements AfterViewInit, OnChanges {

  @Input() values: number[] = [];

  @ViewChild('minaBarGraph', { read: ViewContainerRef })
  private minaBarGraphRef: ViewContainerRef;
  private component: BarGraphComponent;

  constructor(private elementRef: ElementRef<HTMLElement>) { super(); }

  async ngAfterViewInit(): Promise<void> {
    await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.component = this.minaBarGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.component.xStep = 1;
      this.component.xTicksLength = 15;
      this.component.yTicksLength = 6;
      this.component.um = 's';
      this.component.yAxisLabel = 'Count';
      this.component.decimals = 0;
      this.component.responsive = false;
      this.component.showXTicks = false;
      this.component.showYTicks = false;
      this.component.maxHeight = this.elementRef.nativeElement.offsetHeight;
      this.renderBars();
    });
  }

  ngOnChanges(): void {
    this.renderBars();
  }

  private renderBars(): void {
    if (this.component) {
      this.component.values = this.values;
      this.detect();
      this.component.detect();
    }
  }
}
