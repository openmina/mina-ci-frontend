import { ReportingState } from '@reporting/reporting.state';
import {
  REPORTING_BLOCKS_SORT,
  REPORTING_CLOSE,
  REPORTING_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_GET_REPORTS_SUCCESS, REPORTING_MARK_REPORT_TO_SHOW, REPORTING_PEERS_SORT, REPORTING_SELECT_BLOCK,
  REPORTING_SET_ACTIVE_REPORT,
  ReportingActions, ReportingPeersSort,
} from '@reporting/reporting.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { ReportDetailBlock } from '@shared/types/reporting/report-detail-block.type';
import { sort } from '@shared/helpers/array.helper';
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
};

export function reducer(state: ReportingState = initialState, action: ReportingActions): ReportingState {
  switch (action.type) {

    case REPORTING_GET_REPORTS_SUCCESS: {
      return {
        ...state,
        reports: action.payload,
        idToShow: undefined,
      };
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
