import {
  REPORTING_BUILDS_BLOCKS_SORT,
  REPORTING_BUILDS_CLOSE,
  REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_BUILDS_GET_REPORTS_SUCCESS,
  REPORTING_BUILDS_MARK_REPORT_TO_SHOW,
  REPORTING_BUILDS_PEERS_SORT,
  REPORTING_BUILDS_SELECT_BLOCK,
  REPORTING_BUILDS_SET_ACTIVE_REPORT,
  REPORTING_BUILDS_TOGGLE_DELTA,
  REPORTING_BUILDS_TOGGLE_FILTER,
  ReportingBuildsActions,
} from '@reporting/builds/reporting-builds.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { sort, toggleItem } from '@shared/helpers/array.helper';
import { ReportDetailBlockPeerTiming } from '@shared/types/reporting/report-detail-block-peer-timing.type';
import { ReportingBuildsState } from '@reporting/builds/reporting-builds.state';

const initialState: ReportingBuildsState = {
  reports: [],
  activeReport: undefined,
  activeReportDetail: {
    blocks: [],
  },
  idToShow: undefined,
  blockSort: {
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
  delta: false,
};

export function reducer(state: ReportingBuildsState = initialState, action: ReportingBuildsActions): ReportingBuildsState {
  switch (action.type) {

    case REPORTING_BUILDS_GET_REPORTS_SUCCESS: {
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

    case REPORTING_BUILDS_TOGGLE_DELTA: {
      return {
        ...state,
        delta: !state.delta,
      };
    }

    case REPORTING_BUILDS_SET_ACTIVE_REPORT: {
      return {
        ...state,
        activeReport: action.payload,
      };
    }

    case REPORTING_BUILDS_GET_REPORT_DETAIL_SUCCESS: {
      return {
        ...state,
        activeReportDetail: {
          ...action.payload,
          blocks: sortBlocks(action.payload.blocks, state.blockSort),
        },
      };
    }

    case REPORTING_BUILDS_MARK_REPORT_TO_SHOW: {
      return {
        ...state,
        idToShow: action.payload,
      };
    }

    case REPORTING_BUILDS_BLOCKS_SORT: {
      return {
        ...state,
        blockSort: action.payload,
        activeReportDetail: {
          ...state.activeReportDetail,
          blocks: sortBlocks(state.activeReportDetail.blocks, action.payload),
        },
      };
    }

    case REPORTING_BUILDS_PEERS_SORT: {
      return {
        ...state,
        peerSort: action.payload,
        activeBlock: {
          ...state.activeBlock,
          peerTimings: sortPeers(state.activeBlock.peerTimings, action.payload),
        },
      };
    }

    case REPORTING_BUILDS_SELECT_BLOCK: {
      return {
        ...state,
        activeBlock: {
          ...action.payload,
          peerTimings: sortPeers(action.payload.peerTimings, state.peerSort),
        },
      };
    }

    case REPORTING_BUILDS_TOGGLE_FILTER: {
      return {
        ...state,
        activeFilters: toggleItem(state.activeFilters, action.payload),
      };
    }

    case REPORTING_BUILDS_CLOSE:
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
