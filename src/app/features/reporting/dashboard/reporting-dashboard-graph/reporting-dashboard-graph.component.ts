import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import * as d3 from 'd3';
import { AxisDomain, curveLinear } from 'd3';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReportDashboardGraphPoint } from '@shared/types/reporting/report-dashboard-graph-point.type';
import { niceYScale } from '@shared/helpers/graph.helper';
import { sort } from '@shared/helpers/array.helper';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { debounceTime, fromEvent, skip } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { MIN_WIDTH_1200, MIN_WIDTH_1600, MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';
import { Area } from 'd3-shape';
import { hasValue } from '@shared/helpers/values.helper';
import { Selection } from 'd3-selection';

@Component({
  selector: 'mina-reporting-dashboard-graph',
  templateUrl: './reporting-dashboard-graph.component.html',
  styleUrls: ['./reporting-dashboard-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-100 flex-row' },
  providers: [DatePipe],
})
export class ReportingDashboardGraphComponent extends StoreDispatcher implements AfterViewInit, OnChanges {

  @Input() data: ReportDashboardGraphPoint[];
  @Input() color: string;
  @Input() id: number;
  @Input() clickerVisible: boolean;
  @Input() preselectValue: boolean;
  @Input() weekly: boolean;

  @Output() activePointClick = new EventEmitter<ReportDashboardGraphPoint>();

  @ViewChild('chart') private chart: ElementRef<HTMLDivElement>;

  private readonly paths: string[] = ['avg', 'max'];

  private margin = { top: 10, right: 30, bottom: 30, left: 60 };
  private width: number;
  private height: number = 200 - this.margin.top - this.margin.bottom;
  private svg: any;
  private mainG: any;

  private clickableRect: any;
  private xScale: any;
  private yScale: any;
  private xAxisElement: any;
  private yAxisElement: any;
  private xAxis: any;
  private yAxis: any;
  private xAxisTicks: number;
  private lines: any[] = [];

  private clicker: any;
  private clickerLocationPercentage: number;
  private area: Area<ReportDashboardGraphPoint>;

  constructor(private router: Router,
              private datePipe: DatePipe,
              private elementRef: ElementRef<HTMLElement>,
              private breakpointObserver: BreakpointObserver) { super(); }

  ngAfterViewInit(): void {
    this.initGraph();
    this.listenToWindowResizing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart && this.data.length > 0 && changes['data']?.previousValue !== changes['data']?.currentValue) {
      this.updateGraph();
    }

    if (this.preselectValue) {
      setTimeout(() => {
        this.preselectValue = false;
        this.showClickerOnChanges();
      }, 1);
    }

    if (changes['weekly']?.previousValue !== changes['weekly']?.currentValue && hasValue(changes['weekly']?.previousValue) && hasValue(this.clickerLocationPercentage)) {
      this.showClickerOnChanges();
    }

    if (!this.clickerVisible) {
      this.clicker?.style('opacity', 0);
      this.clickerLocationPercentage = undefined;
    }
  }

  private showClickerOnChanges(): void {
    const id = Number(new URL(window.location.href).pathname.split('/')[2]);
    const index = this.data.map(d => d.number).indexOf(id) + 1;
    const x0 = index * this.width / this.data.length;
    this.showClicker(x0);
  }

  private initGraph(): void {
    this.width = this.chart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = this.createSVG();
    this.mainG = this.createMainG();
    this.clicker = this.createClicker();
    this.createClickableRect();
    this.addXAxis();
    this.addYAxis();
    this.addLinearGradientDefs();
  }

  private updateGraph(): void {
    this.redrawXAxis();
    this.redrawYAxis();
    this.addGridLines();
    this.drawPath();
    this.addCircles();
    this.clicker.raise();
    this.clickableRect.raise();
    this.listenToClickOnRect();
  }

  private createClickableRect(): void {
    if (!this.clickableRect) {
      this.clickableRect = this.mainG
        .append('rect')
        .attr('fill', 'transparent')
        .attr('cursor', 'pointer')
        .attr('width', this.width)
        .attr('height', this.height);
    }
  }

  private createClicker(): any {
    const clicker = this.mainG
      .append('g')
      .attr('class', 'clicker')
      .style('opacity', 0);

    clicker
      .append('rect')
      .attr('fill', 'var(--selected-primary)')
      .attr('stroke-width', 4)
      .attr('stroke', 'var(--selected-container)')
      .attr('width', 2)
      .attr('x', -1)
      .attr('y', 1)
      .attr('height', this.height);
    return clicker;
  }

  private listenToClickOnRect(): void {
    this.clickableRect
      .datum(this.data)
      .on('click', (evt: PointerEvent) => {
        const mouseX = d3.pointer(evt)[0];
        const point = this.showClicker(mouseX);
        this.activePointClick.emit(point);
      });
  }

  private showClicker(mouseX: number): ReportDashboardGraphPoint {
    const points = sort(this.data, { sortBy: 'index', sortDirection: SortDirection.ASC }, []);
    const x0 = this.xScale.invert(mouseX);
    const i = d3.bisector((d: ReportDashboardGraphPoint) => d.index).left(points, x0, 1);
    const point0 = points[i - 1];
    const point1 = points[i];
    const point = x0 - point0.index > point1.index - x0 ? point1 : point0;

    const x = this.xScale(point.index);
    this.clickerLocationPercentage = (x / this.width) * 100;
    this.clicker
      .style('opacity', 1)
      .attr('transform', `translate(${x})`);
    return point;
  }

  private drawPath(): void {
    this.mainG.selectAll('.data-path-avg' + this.id).remove();
    this.mainG.selectAll('.data-path-max' + this.id).remove();
    this.lines = [];

    this.mainG.selectAll(`.area${this.id}`).remove();
    this.area = this.getArea();

    this.paths.forEach((path: string) => {
      const line = this.mainG.append('path')
        .datum(this.data)
        .attr('class', 'data-path data-path-' + path + this.id)
        .attr('fill', 'none')
        .attr('stroke', this.color)
        .attr('stroke-width', 1)
        .attr('d', d3.line<ReportDashboardGraphPoint>()
          .x((d: ReportDashboardGraphPoint) => this.xScale(d.index))
          .y((d: ReportDashboardGraphPoint) => this.yScale(d[path]))
          .curve(curveLinear),
        );
      if (path === 'avg') {
        line.style('stroke-dasharray', '3, 3');
      } else {
        this.mainG.append('path')
          .datum(this.data)
          .attr('class', `area${this.id}`)
          .attr('d', this.area)
          .style('fill', `url(#pathGrad${this.id})`);
      }

      this.lines.push(line);
    });
  }

  private getArea(): Area<ReportDashboardGraphPoint> {
    return d3.area<ReportDashboardGraphPoint>()
      .x((d: ReportDashboardGraphPoint) => this.xScale(d.index))
      .y0(this.height)
      .y1((d: ReportDashboardGraphPoint) => this.yScale(d.max));
  }

  private addCircles(): void {
    let circlesG = this.mainG.selectAll('g.circles');
    if (circlesG.size() <= 0) {
      circlesG = this.mainG.append('g').attr('class', 'circles');
    }

    const addPosition = (c: Selection<SVGCircleElement, ReportDashboardGraphPoint, SVGGElement, any>) => {
      return c
        .attr('cx', (d: ReportDashboardGraphPoint) => this.xScale(d.index))
        .attr('cy', (d: ReportDashboardGraphPoint) => this.yScale(d.max))
        .style('fill', this.color);
    };

    const circles = circlesG.selectAll('circle').data(this.data);

    // Update existing circles
    addPosition(circles);

    // Remove extra circles
    circles.exit().remove();

    // Add new circles
    addPosition(
      circles.enter()
        .append('circle')
        .attr('r', 4),
    );
  }

  private redrawXAxis(): void {
    this.xScale = d3.scaleLinear()
      .domain(d3.extent<ReportDashboardGraphPoint, number>(this.data, d => d.index))
      .range([0, this.width]);
    this.xAxis = d3.axisBottom<number>(this.xScale)
      .tickSize(0)
      .ticks(this.xAxisTicks)
      .tickFormat((index: number) => this.getMonthName(this.data[index]))
      .tickPadding(10);
    this.xAxisElement
      .call(this.xAxis);
  }

  private getMonthName(point: ReportDashboardGraphPoint): string {
    if (hasValue(point.month)) {
      const date = new Date(`${point.month + 1}/01/2022`);
      date.setMonth(point.month);
      return date.toLocaleString('en-US', { month: 'long' });
    } else {
      return point.week + ' weeks ago';
    }
  }

  private redrawYAxis(): void {
    this.yScale = d3.scaleLinear()
      .domain([0, this.getMax()])
      .range([this.height, 0])
      .nice();
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(0)
      .ticks(2.5)
      .tickFormat((d: AxisDomain) => `${d}s`)
      .tickPadding(10);
    this.yAxisElement
      .call(this.yAxis);
  }

  private getMax(): number {
    return niceYScale(0, Math.max(...this.data.map(d => d.max)), 3)[1];
  }

  private addGridLines(): void {
    this.mainG.selectAll('g.tick line').remove();
    this.mainG.selectAll('g.yAxis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('stroke', 'var(--base-divider)')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.width)
      .attr('y2', 0);
    this.mainG.selectAll('g.xAxis g.tick')
      .append('line')
      .attr('class', 'gridline')
      .attr('stroke', 'var(--base-divider)')
      .attr('x1', 0)
      .attr('y1', -this.height)
      .attr('x2', 0)
      .attr('y2', 0);
  }

  private createMainG(): any {
    return this.svg
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private createSVG(): any {
    return d3.select(this.chart.nativeElement)
      .append('svg')
      .attr('class', 'overflow-visible');
  }

  private addXAxis(): void {
    this.xScale = d3.scaleLinear()
      .domain(d3.extent<ReportDashboardGraphPoint, number>(this.data, d => d.index))
      .range([0, this.width]);
    this.xAxisElement = this.mainG.append('g')
      .attr('class', 'xAxis inter tertiary f-base user-none')
      .attr('transform', `translate(0, ${this.height})`);
    const xTicks = this.getXTicks();
    this.xAxisTicks = xTicks;
    this.xAxis = d3.axisBottom<number>(this.xScale)
      .tickSize(0)
      .ticks(xTicks)
      .tickFormat((index: number) => this.getMonthName(this.data[index]))
      .tickPadding(10);
    this.xAxisElement
      .call(this.xAxis)
      .select('.domain')
      .attr('stroke-width', 0);
    this.xAxisElement.selectAll('.tick line').remove();
  }

  private addYAxis(): void {
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max([0])])
      .range([this.height, 0])
      .nice();
    this.yAxisElement = this.mainG.append('g')
      .attr('class', 'yAxis inter tertiary f-base user-none');
    this.yAxis = d3.axisLeft(this.yScale)
      .tickSize(0)
      .tickFormat((d: AxisDomain) => `${d}s`)
      .tickPadding(10);

    this.yAxisElement
      .call(this.yAxis)
      .select('.domain')
      .attr('stroke-width', 0);
    this.yAxisElement.selectAll('.tick line').remove();
  }

  private addLinearGradientDefs(): void {
    let linearGradient;
    const found = this.mainG.select('#pathGrad' + this.id);
    if (found.size() > 0) {
      linearGradient = found;
    } else {
      linearGradient = this.mainG.append('defs').append('linearGradient')
        .attr('id', 'pathGrad' + this.id);
    }
    linearGradient
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    linearGradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', this.color)
      .style('stop-opacity', 0.08);

    linearGradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', this.color)
      .style('stop-opacity', 0.02);
  }

  private getXTicks(): number {
    const width = this.elementRef.nativeElement.offsetWidth;
    if (width < 500) {
      return 3;
    } else if (width < 700) {
      return 5;
    } else if (width < 1000) {
      return 7;
    } else {
      return 12;
    }
  }

  private listenToWindowResizing(): void {
    this.breakpointObserver.observe([MIN_WIDTH_1600, MIN_WIDTH_1200, MIN_WIDTH_700])
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.redrawChart();
      });

    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => this.redrawChart());
  }

  public redrawChart(): void {
    this.width = this.chart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg.attr('width', this.width + this.margin.left + this.margin.right);

    this.xScale.range([0, this.width]);

    const currTicks = this.getXTicks();
    this.xAxis.ticks(currTicks);
    this.xAxis.scale(this.xScale);
    this.xAxisElement.call(this.xAxis);

    if (this.xAxisTicks !== currTicks) {
      this.xAxisElement.selectAll('g.tick line').remove();
      this.mainG.selectAll('g.xAxis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', -this.height)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'var(--base-divider)');
    }
    this.xAxisTicks = currTicks;

    this.mainG.selectAll('g.yAxis g.tick line.gridline')
      .attr('x2', this.width);

    this.addLinearGradientDefs();

    this.area = this.getArea();
    this.mainG.selectAll(`.area${this.id}`).remove();

    this.lines.forEach((line: any, i: number) => {
      line.attr('d', d3.line<ReportDashboardGraphPoint>()
        .x((d: ReportDashboardGraphPoint) => this.xScale(d.index))
        .y((d: ReportDashboardGraphPoint) => this.yScale(d[this.paths[i]]))
        .curve(curveLinear),
      );

      if (this.paths[i] === 'max') {
        this.mainG.append('path')
          .datum(this.data)
          .attr('class', `area${this.id}`)
          .attr('d', this.area)
          .style('fill', `url(#pathGrad${this.id})`);
      }
    });

    this.addCircles();

    this.clickableRect
      .attr('width', this.width)
      .attr('height', this.height)
      .raise();
    if (this.clickerLocationPercentage) {
      const mouseX = this.width * this.clickerLocationPercentage / 100;
      this.showClicker(mouseX);
    }
  };
}
