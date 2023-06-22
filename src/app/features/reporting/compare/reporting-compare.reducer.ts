import { ReportingCompareState } from '@reporting/compare/reporting-compare.state';
import {
  REPORTING_COMPARE_BLOCKS_SORT,
  REPORTING_COMPARE_CLOSE, REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS,
  REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_COMPARE_GET_REPORTS_SUCCESS,
  REPORTING_COMPARE_PEERS_SORT,
  REPORTING_COMPARE_SELECT_FIRST_BLOCK,
  REPORTING_COMPARE_SELECT_SECOND_BLOCK,
  ReportingCompareActions,
} from '@reporting/compare/reporting-compare.actions';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

const initialState: ReportingCompareState = {
  reports: [null, null],
  allReports: [],
  graphConfig: undefined,
  firstReportDetail: undefined,
  secondReportDetail: undefined,
  firstActiveBlock: undefined,
  secondActiveBlock: undefined,
  blockSort: {
    sortBy: 'height',
    sortDirection: SortDirection.DSC,
  },
  peerSort: {
    sortBy: 'receiveLatency',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: ReportingCompareState = initialState, action: ReportingCompareActions): ReportingCompareState {
  switch (action.type) {

    case REPORTING_COMPARE_GET_REPORTS_SUCCESS: {
      return {
        ...state,
        allReports: action.payload,
      };
    }

    case REPORTING_COMPARE_GET_COMPARE_REPORTS_SUCCESS: {
      return {
        ...state,
        reports: action.payload,
        graphConfig: {
          graphMaxPointProduction: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.productionTimesBars.map(c => c.count)], [])),
          graphMaxPointApplication: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.applicationTimesBars.map(c => c.count)], [])),
          graphMaxPointLatency: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.receiveLatenciesBars.map(c => c.count)], [])),
          graphMaxPointProductionDelta: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.productionTimesDeltaBars.map(c => c.count)], [])),
          graphMaxPointApplicationDelta: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.applicationTimesDeltaBars.map(c => c.count)], [])),
          graphMaxPointLatencyDelta: Math.max(...action.payload.reduce((acc, curr) => [...acc, ...curr.receiveLatenciesDeltaBars.map(c => c.count)], [])),
          graphMinPointProductionDelta: Math.min(...action.payload.reduce((acc, curr) => [...acc, ...curr.productionTimesDeltaBars.map(c => c.count)], [])),
          graphMinPointApplicationDelta: Math.min(...action.payload.reduce((acc, curr) => [...acc, ...curr.applicationTimesDeltaBars.map(c => c.count)], [])),
          graphMinPointLatencyDelta: Math.min(...action.payload.reduce((acc, curr) => [...acc, ...curr.receiveLatenciesDeltaBars.map(c => c.count)], [])),
        },
      };
    }

    case REPORTING_COMPARE_GET_REPORT_DETAIL_SUCCESS: {
      return {
        ...state,
        [action.payload.type + 'ReportDetail']: action.payload.detail,
      };
    }

    case REPORTING_COMPARE_BLOCKS_SORT: {
      return {
        ...state,
        blockSort: action.payload,
        firstReportDetail: {
          ...state.firstReportDetail,
          blocks: sortBlocks(state.firstReportDetail.blocks, action.payload),
        },
        secondReportDetail: {
          ...state.secondReportDetail,
          blocks: sortBlocks(state.secondReportDetail.blocks, action.payload),
        },
      };
    }

    case REPORTING_COMPARE_PEERS_SORT: {
      return {
        ...state,
        peerSort: action.payload,
        firstActiveBlock: {
          ...state.firstActiveBlock,
          peerTimings: sortPeers(state.firstActiveBlock.peerTimings, action.payload),
        },
        secondActiveBlock: {
          ...state.secondActiveBlock,
          peerTimings: sortPeers(state.secondActiveBlock.peerTimings, action.payload),
        },
      };
    }

    case REPORTING_COMPARE_SELECT_FIRST_BLOCK: {
      return {
        ...state,
        firstActiveBlock: {
          ...action.payload,
          peerTimings: sortPeers(action.payload.peerTimings, state.peerSort),
        },
      };
    }

    case REPORTING_COMPARE_SELECT_SECOND_BLOCK: {
      return {
        ...state,
        secondActiveBlock: {
          ...action.payload,
          peerTimings: sortPeers(action.payload.peerTimings, state.peerSort),
        },
      };
    }

    case REPORTING_COMPARE_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortBlocks(blocks: ReportDetailBlock[], tableSort: TableSort<ReportDetailBlock>): ReportDetailBlock[] {
  return sort(blocks, tableSort, ['blockHash']);
}

function sortPeers(peers: ReportDetailBlockPeerTiming[], tableSort: TableSort<ReportDetailBlockPeerTiming>): ReportDetailBlockPeerTiming[] {
  return sort(peers, tableSort, ['node']);
}
