import { ReportingState } from '@reporting/reporting.state';
import {
  REPORTING_BLOCKS_SORT,
  REPORTING_CLOSE,
  REPORTING_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_GET_REPORTS_SUCCESS, REPORTING_MARK_REPORT_TO_SHOW, REPORTING_PEERS_SORT, REPORTING_SELECT_BLOCK,
  REPORTING_SET_ACTIVE_REPORT, REPORTING_TOGGLE_DELTA, REPORTING_TOGGLE_FILTER,
  ReportingActions, ReportingPeersSort,
} from '@reporting/reporting.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { sort, toggleItem } from '@shared/helpers/array.helper';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';

const initialState: ReportingState = {
  reports: [],
  activeReport: undefined,
  activeReportDetail: {
    blocks: [],
  },
  idToShow: undefined,
  sort: {
    sortBy: 'height',
    sortDirection: SortDirection.DSC,
  },
  activeBlock: undefined,
  peerSort: {
    sortBy: 'receiveLatency',
    sortDirection: SortDirection.DSC,
  },
  activeFilters: ['success'],
  graphConfig: undefined,
  delta: true,
};

export function reducer(state: ReportingState = initialState, action: ReportingActions): ReportingState {
  switch (action.type) {

    case REPORTING_GET_REPORTS_SUCCESS: {
      return {
        ...state,
        reports: action.payload,
        idToShow: undefined,
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

    case REPORTING_TOGGLE_DELTA: {
      return {
        ...state,
        delta: !state.delta,
      }
    }

    case REPORTING_SET_ACTIVE_REPORT: {
      return {
        ...state,
        activeReport: action.payload,
      };
    }

    case REPORTING_GET_REPORT_DETAIL_SUCCESS: {
      return {
        ...state,
        activeReportDetail: {
          ...action.payload,
          blocks: sortBlocks(action.payload.blocks, state.sort),
        },
      };
    }

    case REPORTING_MARK_REPORT_TO_SHOW: {
      return {
        ...state,
        idToShow: action.payload,
      };
    }

    case REPORTING_BLOCKS_SORT: {
      return {
        ...state,
        sort: action.payload,
        activeReportDetail: {
          ...state.activeReportDetail,
          blocks: sortBlocks(state.activeReportDetail.blocks, action.payload),
        },
      };
    }

    case REPORTING_PEERS_SORT: {
      return {
        ...state,
        peerSort: action.payload,
        activeBlock: {
          ...state.activeBlock,
          peerTimings: sortPeers(state.activeBlock.peerTimings, action.payload),
        },
      };
    }

    case REPORTING_SELECT_BLOCK: {
      return {
        ...state,
        activeBlock: {
          ...action.payload,
          peerTimings: sortPeers(action.payload.peerTimings, state.peerSort),
        },
      };
    }

    case REPORTING_TOGGLE_FILTER: {
      return {
        ...state,
        activeFilters: toggleItem(state.activeFilters, action.payload)
      }
    }

    case REPORTING_CLOSE:
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
