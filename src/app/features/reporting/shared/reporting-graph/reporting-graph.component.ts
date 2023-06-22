import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { ReportBar } from '@shared/types/reporting/report-bar.type';
import * as d3 from 'd3';
import { AxisDomain } from 'd3';
import { niceYScale } from '@shared/helpers/graph.helper';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-reporting-graph',
  templateUrl: './reporting-graph.component.html',
  styleUrls: ['./reporting-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingGraphComponent extends ManualDetection implements AfterViewInit, OnChanges {

  @Input() bars: ReportBar[] = [];
  @Input() color: string;
  @Input() delta: boolean;
  @Input() maxPoint: number;
  @Input() maxPointDelta: number;
  @Input() minPointDelta: number;

  @ViewChild('dataViz') private dataViz: ElementRef<HTMLDivElement>;

  private margin = { top: 20, right: 0, bottom: 20, left: 25 };
  private width: number;
  private height: number;
  private svg: any;
  private g: any;
  private barsContainer: any;
  private xScale: any;
  private xAxis: any;
  private yScale: any;
  private yAxisGrid: any;

  ngAfterViewInit(): void {
    this.renderGraph();
    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this))
      .subscribe(() => this.redraw());
  }

  ngOnChanges(): void {
    if (this.g) {
      this.calculateXScale();
      this.calculateYScale();
      this.drawBars();
    }
  }

  private renderGraph(): void {
    this.createWidthAndHeight();
    this.svg = d3.select(this.dataViz.nativeElement).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.calculateXScale();
    this.calculateYScale();
    this.createBarsContainer();
    this.drawBars();
  }

  private createWidthAndHeight(): void {
    this.width = this.dataViz.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.dataViz.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
  }

  public redraw(): void {
    this.createWidthAndHeight();
    this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
    this.calculateXScale();
    this.calculateYScale();
    this.drawBars();
  }

  private createBarsContainer(): void {
    this.barsContainer = this.g
      .append('g')
      .attr('class', 'bars-container');
    this.barsContainer
      .selectAll('.bar')
      .data(Array(50).fill(0))
      .enter()
      .append('rect')
      .attr('class', 'bar');
  }

  private calculateXScale(): void {
    const xValues = this.bars.map(d => d.range.toString());
    this.xScale = d3.scaleBand()
      .domain(xValues)
      .padding(0.1)
      .range([0, this.width]);

    this.xAxis = d3.axisBottom<string>(this.xScale).tickSize(0)
      .tickValues(xValues.filter((value: string, index: number) => index % 5 === 0))
      .tickFormat(d => d + 's');

    this.g.select('.x-tick-parent').remove();
    const xAxisTicksParent = this.g.append('g');
    xAxisTicksParent
      .attr('class', 'x-tick-parent')
      .attr('transform', 'translate(0,' + (this.height) + ')')
      .call(this.xAxis);
    xAxisTicksParent.select('path').remove();
    xAxisTicksParent
      .selectAll('g.tick text')
      .attr('fill', 'var(--base-tertiary)');
  }

  private calculateYScale(): void {
    let domain: number[];
    if (this.delta) {
      if (this.minPointDelta >= 0) {
        domain = [0, Math.max(this.maxPointDelta, 10)];
      } else {
        domain = [this.minPointDelta, Math.max(this.maxPointDelta, 10)];
      }
    } else {
      domain = [0, Math.max(this.maxPoint, 10)];
    }
    const ticks = ReportingGraphComponent.yTicks(domain);
    this.yScale = d3.scaleLinear()
      .domain(d3.extent(ticks))
      .range([this.height, 0])
      .nice();
    this.yAxisGrid = d3.axisLeft(this.yScale)
      .tickSize(-this.width - this.margin.left)
      .tickFormat((d: AxisDomain) => (d > 0 ? '+' : '') + d)
      .tickValues(ticks.reverse());

    this.g.select('.y.axis-grid').remove();
    const yAxisTicksParent = this.g.append('g');
    yAxisTicksParent
      .attr('class', 'y axis-grid')
      .attr('transform', `translate(${-this.margin.left},0)`)
      .call(this.yAxisGrid);
    yAxisTicksParent.select('path').remove();
    yAxisTicksParent.select('g.tick:last-child text').remove();

    yAxisTicksParent
      .selectAll('g.tick text')
      .attr('text-anchor', 'start')
      .attr('transform', `translate(5, -6)`)
      .attr('fill', 'var(--base-tertiary)');

    yAxisTicksParent
      .selectAll('g.tick line')
      .attr('stroke', 'var(--base-divider)');
  }

  private drawBars(): void {
    this.barsContainer.raise();
    this.barsContainer
      .selectAll('.bar')
      .data(this.bars)
      .attr('fill', this.delta ? ((d: ReportBar) => `var(--${d.count <= 0 ? 'success' : 'warn'}-primary)`) : this.color)
      .attr('x', (d: ReportBar) => this.xScale(d.range.toString()))
      .attr('width', this.xScale.bandwidth())
      .attr('y', (d: ReportBar) => {
        if (this.delta) {
          return d.count === 0 ? this.yScale(0) : this.yScale(d.count > 0 ? d.count : 0);
        } else {
          return d.count > 0 ? this.yScale(d.count) : (this.height - 1);
        }
      })
      .attr('height', (d: ReportBar) => Math.max(0.3, Math.abs(this.yScale(d.count) - this.yScale(0))));
  }

  private static yTicks(values: number[]): number[] {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const [ySpacing, yMaxTick, yMinTick] = niceYScale(min, max, 5);
    const yTicks = [];

    for (let i = Math.max(yMaxTick, 5); i >= yMinTick; i -= Math.max(1, ySpacing)) {
      yTicks.push(i);
    }
    return yTicks;
  }
}
