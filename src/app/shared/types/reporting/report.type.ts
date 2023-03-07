export interface Report {
  id : number;
  name : string;
  commit: string;
  repo: string;
  timestamp: number;
  status: 'passed' | 'failed' | 'pending';
  transactions: number;
  height : number;
  filled: number;
  blocks: number;
  latencyAvg: number;
  latencyMax: number;
  latencyMin: number;
  link: string;
}
