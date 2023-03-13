import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Report } from '@shared/types/reporting/report.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectReportingActiveReport, selectReportingActiveReportDetail } from '@reporting/reporting.state';
import { ReportingSelectBlock, ReportingSetActiveReport } from '@reporting/reporting.actions';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import * as d3 from 'd3';
import { Router } from '@angular/router';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { BarGraphComponent } from '@shared/components/bar-graph/bar-graph.component';
import { filter } from 'rxjs';

@Component({
  selector: 'mina-reporting-side-panel',
  templateUrl: './reporting-side-panel.component.html',
  styleUrls: ['./reporting-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column' },
})
export class ReportingSidePanelComponent extends StoreDispatcher implements OnInit, AfterViewInit {

  activeReport: Report;
  activeReportDetail: ReportDetail;
  activeStep: number =1;
  slowestBlock: ReportDetailBlock;

  @ViewChild('receiveLatenciesGraph', { read: ViewContainerRef })
  private receiveLatenciesGraphRef: ViewContainerRef;
  @ViewChild('blockProductionGraph', { read: ViewContainerRef })
  private blockProductionGraphRef: ViewContainerRef;
  @ViewChild('blockApplicationGraph', { read: ViewContainerRef })
  private blockApplicationGraphRef: ViewContainerRef;

  private receiveLatenciesGraph: BarGraphComponent;
  private blockProductionGraph: BarGraphComponent;
  private blockApplicationGraph: BarGraphComponent;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.buildGraph();
    // }, 100);
  }

  ngAfterViewInit(): void {
    this.listenToActiveReport();
    this.getActiveReportDetail();
  }

  private async initGraphComponents(): Promise<void> {
    return await import('@shared/components/bar-graph/bar-graph.component').then(c => {
      this.receiveLatenciesGraph = this.receiveLatenciesGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.receiveLatenciesGraph.xStep = 0.1;
      this.receiveLatenciesGraph.xTicksLength = 50;
      this.receiveLatenciesGraph.yTicksLength = 6;
      this.receiveLatenciesGraph.um = 's';
      this.receiveLatenciesGraph.yAxisLabel = 'Count';
      this.receiveLatenciesGraph.decimals = 1;
      this.receiveLatenciesGraph.responsive = false;
      this.receiveLatenciesGraph.color = 'var(--special-selected-alt-1-primary)';
      this.receiveLatenciesGraph.xTicksSkipper = 5;
      this.receiveLatenciesGraph.ngOnInit();

      this.blockProductionGraph = this.blockProductionGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.blockProductionGraph.xStep = 2;
      this.blockProductionGraph.xTicksLength = 50;
      this.blockProductionGraph.yTicksLength = 6;
      this.blockProductionGraph.um = 's';
      this.blockProductionGraph.yAxisLabel = 'Count';
      this.blockProductionGraph.decimals = 0;
      this.blockProductionGraph.responsive = false;
      this.blockProductionGraph.color = 'var(--special-selected-alt-2-primary)';
      this.blockProductionGraph.xTicksSkipper = 5;
      this.blockProductionGraph.ngOnInit();

      this.blockApplicationGraph = this.blockApplicationGraphRef.createComponent<BarGraphComponent>(c.BarGraphComponent).instance;
      this.blockApplicationGraph.xStep = 1;
      this.blockApplicationGraph.xTicksLength = 50;
      this.blockApplicationGraph.yTicksLength = 6;
      this.blockApplicationGraph.um = 's';
      this.blockApplicationGraph.yAxisLabel = 'Count';
      this.blockApplicationGraph.decimals = 0;
      this.blockApplicationGraph.responsive = false;
      this.blockApplicationGraph.color = 'var(--special-selected-alt-3-primary)';
      this.blockApplicationGraph.xTicksSkipper = 5;
      this.blockApplicationGraph.ngOnInit();
    });
  }

  private listenToActiveReport(): void {
    this.select(selectReportingActiveReport, async (report: Report) => {
      this.activeReport = report;
      this.detect();

      if (!this.receiveLatenciesGraph) {
        await this.initGraphComponents();
      }
      this.receiveLatenciesGraph.values = report.receiveLatencies;
      this.receiveLatenciesGraph.update();
      this.receiveLatenciesGraph.detect();

      this.blockProductionGraph.values = report.productionTimes;
      this.blockProductionGraph.update();
      this.blockProductionGraph.detect();

      this.blockApplicationGraph.values = report.applicationTimes;
      this.blockApplicationGraph.update();
      this.blockApplicationGraph.detect();
    }, filter(Boolean));
  }

  private getActiveReportDetail(): void {
    this.select(selectReportingActiveReportDetail, (detail: ReportDetail) => {
      this.activeReportDetail = detail;
      const maxTime = Math.max(...detail.blocks.map(block => block.maxReceiveLatency));
      this.slowestBlock = detail.blocks.find(block => block.maxReceiveLatency === maxTime);
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(ReportingSetActiveReport, undefined);
    this.router.navigate(['']);
  }

  updateStep(step: number): void {
    this.activeStep = step;
  }

  private buildGraph() {
// set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 20, left: 50 };
    const offsetWidth = document.getElementById('my_dataviz').offsetWidth;
    const width = offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    const svg = d3.select('#my_dataviz')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

// Parse the Data
    d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv').then(function (data: any) {
      data = mock;

      console.log(data);
      // List of subgroups = header of the csv files = soil condition here
      const subgroups = ['bottom', 'top'];

      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = data.map((d: any) => (d.height));

      // Add X axis
      const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.05] as any);
      svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(0).tickSize(0));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);
      svg.append('g')
        .call(d3.axisLeft(y).ticks(0).tickSize(0));

      //stack the data? --> stack per subgroup
      const stackedData = d3.stack()
        .keys(subgroups)
        (data as any);

      let i = 0;
      // Show the bars
      svg.append('g')
        .selectAll('g')
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join('g')
        .selectAll('rect')
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join('rect')
        .attr('x', d => x((d.data as any).height as any))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
        .attr('fill', (d: any) => {
          const better = d.data.isBetterTime;
          let result: string;
          if (i < stackedData[0].length) {
            result = better ? 'var(--success-secondary)' : '#b37089';
          } else {
            result = better ? '#33526b' : 'var(--warn-primary)';
          }
          i++;
          return result;
        });
    });
  }

  goToSlowest(): void {
    this.dispatch(ReportingSelectBlock, this.slowestBlock);
    this.updateStep(3);
  }
}

const mock = [
  {
    'height': 0,
    'current': 14,
    'previous': 14,
  },
  {
    'height': 1,
    'current': 19,
    'previous': 7,
  },
  {
    'height': 2,
    'current': 29,
    'previous': 27,
  },
  {
    'height': 3,
    'current': 26,
    'previous': 21,
  },
  {
    'height': 4,
    'current': 15,
    'previous': 12,
  },
  {
    'height': 5,
    'current': 25,
    'previous': 5,
  },
  {
    'height': 6,
    'current': 18,
    'previous': 15,
  },
  {
    'height': 7,
    'current': 7,
    'previous': 18,
  },
  {
    'height': 8,
    'current': 14,
    'previous': 18,
  },
  {
    'height': 9,
    'current': 9,
    'previous': 8,
  },
  {
    'height': 10,
    'current': 24,
    'previous': 12,
  },
  {
    'height': 11,
    'current': 27,
    'previous': 14,
  },
  {
    'height': 12,
    'current': 11,
    'previous': 17,
  },
  {
    'height': 13,
    'current': 12,
    'previous': 18,
  },
  {
    'height': 14,
    'current': 23,
    'previous': 19,
  },
  {
    'height': 15,
    'current': 18,
    'previous': 20,
  },
  {
    'height': 16,
    'current': 28,
    'previous': 9,
  },
  {
    'height': 17,
    'current': 20,
    'previous': 12,
  },
  {
    'height': 18,
    'current': 28,
    'previous': 24,
  },
  {
    'height': 19,
    'current': 27,
    'previous': 5,
  },
  {
    'height': 20,
    'current': 11,
    'previous': 24,
  },
  {
    'height': 21,
    'current': 15,
    'previous': 13,
  },
  {
    'height': 22,
    'current': 12,
    'previous': 19,
  },
  {
    'height': 23,
    'current': 29,
    'previous': 20,
  },
  {
    'height': 24,
    'current': 24,
    'previous': 26,
  },
  {
    'height': 25,
    'current': 23,
    'previous': 16,
  },
  {
    'height': 26,
    'current': 27,
    'previous': 11,
  },
  {
    'height': 27,
    'current': 27,
    'previous': 28,
  },
  {
    'height': 28,
    'current': 7,
    'previous': 23,
  },
  {
    'height': 29,
    'current': 5,
    'previous': 25,
  },
].map(d => {
  let x: any = {};
  if (d.current <= d.previous) {
    x.bottom = d.current;
    x.top = d.previous - d.current;
    x.isBetterTime = true;
  } else {
    x.bottom = d.previous;
    x.top = d.current - d.previous;
    x.isBetterTime = false;
  }
  x.height = d.height;
  return x;
});
