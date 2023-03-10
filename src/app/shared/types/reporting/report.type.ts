export interface Report {
  number: number;
  message: string;
  commit: string;
  branch: string;
  started: string;
  timeAgo: string;
  status: 'passed' | 'failed' | 'pending';
  transactions: number;
  blockCount: number;
  canonicalBlockCount: number;
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
}
