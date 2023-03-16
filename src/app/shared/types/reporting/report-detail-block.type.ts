import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

export interface ReportDetailBlock {
  height: number;
  blockHash: string;
  globalSlot: number;
  transactions: number;
  maxReceiveLatency: number;
  datetime: string;
  blockProducer: string;
  blockProducerNodes: string[];
  blockProducerNodesLength: number;
  peerTimings: ReportDetailBlockPeerTiming[];
}
