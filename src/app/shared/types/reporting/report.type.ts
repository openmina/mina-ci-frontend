import { ReportBar } from '@shared/types/reporting/report-bar.type';

export interface Report {
  number: number;
  message: string;
  commit: string;
  branch: string;
  started: string;
  timeAgo: string;
  timestamp: number;
  status: 'success' | 'running' | 'pending' | 'failure' | 'killed';
  transactions: number;
  blockCount: number;
  canonicalBlockCount: number;
  requestTimeoutCount: number;
  requestCount: number;

  blockProductionMin: number;
  blockProductionAvg: number;
  blockProductionMax: number;
  blockApplicationMin: number;
  blockApplicationAvg: number;
  blockApplicationMax: number;
  latencyMin: number;
  latencyAvg: number;
  latencyMax: number;

  applicationTimes: number[];
  productionTimes: number[];
  receiveLatencies: number[];
  applicationTimesBars: ReportBar[];
  productionTimesBars: ReportBar[];
  receiveLatenciesBars: ReportBar[];
  applicationTimesDeltaBars: ReportBar[];
  productionTimesDeltaBars: ReportBar[];
  receiveLatenciesDeltaBars: ReportBar[];

  blockProductionMinDelta: number;
  blockProductionAvgDelta: number;
  blockProductionMaxDelta: number;
  blockApplicationMinDelta: number;
  blockApplicationAvgDelta: number;
  blockApplicationMaxDelta: number;
  receiveLatencyMinDelta: number;
  receiveLatencyAvgDelta: number;
  receiveLatencyMaxDelta: number;

  isRegression: boolean;
}
