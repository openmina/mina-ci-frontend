import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Report } from '@shared/types/reporting/report.type';
import { ciReportsMocks } from '@reporting/ci-reports-mocks';
import { ReportDetail } from '@shared/types/reporting/report-detail.type';
import { activeReportDetailsLvl1 } from '@reporting/active-report-details1';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '@shared/constants/config';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class ReportingService {

  constructor(private http: HttpClient) { }

  getReports(): Observable<Report[]> {
    // return of(ciReportsMocks as ReportResponse[]).pipe(delay(150))
    return this.http.get<ReportResponse[]>(CONFIG.aggregator + '/builds')
      .pipe(
        map((reports: ReportResponse[]) => this.mapReports(reports)),
      );
  }

  private mapReports(reports: ReportResponse[]): Report[] {
    return reports.reverse().map((report: ReportResponse) => ({
      number: report.number,
      message: report.message,
      commit: report.commit,
      branch: report.branch,
      started: toReadableDate(report.started * ONE_THOUSAND, 'HH:mm:ss, dd MMM yy'),
      timeAgo: this.getTimeAgo(report.started),
      status: report.status,
      blockCount: report.block_count,
      transactions: report.tx_count || 0,
      canonicalBlockCount: report.cannonical_block_count,
      blockProductionMin: report.block_production_min,
      blockProductionAvg: parseFloat(report.block_production_avg.toFixed(1)),
      blockProductionMax: report.block_production_max,
      blockApplicationMin: report.block_application_min,
      blockApplicationAvg: parseFloat(report.block_application_avg.toFixed(1)),
      blockApplicationMax: report.block_application_max,
      latencyMin: parseFloat(report.receive_latency_min.toFixed(1)),
      latencyAvg: parseFloat(report.receive_latency_avg.toFixed(1)),
      latencyMax: parseFloat(report.receive_latency_max.toFixed(1)),
      applicationTimes: report.application_times,
      productionTimes: report.production_times,
      receiveLatencies: report.receive_latencies,
    }));
  }

  getReportDetail(number: number): Observable<ReportDetail> {
    // return of(activeReportDetailsLvl1).pipe(delay(150))
    return this.http.get<ReportDetailResponse[]>(CONFIG.aggregator + '/builds/' + number + '/blocks').pipe(
      map((response: ReportDetailResponse[]) => this.mapReportDetail(response)),
    );
  }

  private mapReportDetail(details: ReportDetailResponse[]): ReportDetail {
    return {
      blocks: details.map((block: ReportDetailResponse) => ({
        height: block.height,
        blockHash: block.block_hash,
        globalSlot: Number(block.global_slot),
        transactions: block.tx_count,
        maxReceiveLatency: block.max_receive_latency,
        datetime: toReadableDate(block.date_time * ONE_THOUSAND, 'HH:mm:ss, dd MMM yy'),
        blockProducer: block.block_producer,
        blockProducerNodes: block.block_producer_nodes,
        peerTimings: block.peer_timings.map(peerTiming => ({
          node: peerTiming.node,
          receiveLatency: peerTiming.receive_latency,
          blockProcessingTime: peerTiming.block_processing_time,
        })),
      })),
    };
  }

  private getTimeAgo(timestamp: number): string {
    const timeAgo = new Date().getTime() - (timestamp * ONE_THOUSAND);
    const seconds = Math.floor(timeAgo / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return seconds + ' second' + this.getPluralS(seconds);
    } else if (minutes < 60) {
      return minutes + ' minute' + this.getPluralS(minutes);
    } else if (hours < 24) {
      return hours + ' hour' + this.getPluralS(hours);
    } else if (days < 7) {
      return days + ' day' + this.getPluralS(days);
    } else if (weeks < 4) {
      return weeks + ' week' + this.getPluralS(weeks);
    } else if (months < 12) {
      return months + ' month' + this.getPluralS(months);
    } else {
      return years + ' year' + this.getPluralS(years);
    }
  }

  private getPluralS(n: number): string {
    return n === 1 ? '' : 's';
  }
}

interface ReportResponse {
  number: number;
  message: string;
  commit: string;
  branch: string;
  started: number;
  status: 'passed' | 'failed' | 'pending';
  block_count: number;
  tx_count: number;
  cannonical_block_count: number;
  block_production_min: number;
  block_production_avg: number;
  block_production_max: number;
  block_application_min: number;
  block_application_avg: number;
  block_application_max: number;
  receive_latency_min: number;
  receive_latency_avg: number;
  receive_latency_max: number;
  application_times: number[];
  production_times: number[];
  receive_latencies: number[];
}


export interface ReportDetailResponse {
  height: number;
  block_hash: string;
  global_slot: string;
  tx_count: number;
  max_receive_latency: number;
  date_time: number;
  block_producer: string;
  block_producer_nodes: string[];
  peer_timings: {
    node: string;
    block_processing_time: number;
    receive_latency: number;
  }[];
}
