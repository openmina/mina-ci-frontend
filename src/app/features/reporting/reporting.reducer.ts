import { ReportingState } from '@reporting/reporting.state';
import {
  REPORTING_CLOSE,
  REPORTING_GET_REPORT_DETAIL_SUCCESS,
  REPORTING_GET_REPORTS_SUCCESS, REPORTING_MARK_REPORT_TO_SHOW,
  REPORTING_SET_ACTIVE_REPORT,
  ReportingActions,
} from '@reporting/reporting.actions';

const initialState: ReportingState = {
  reports: [],
  activeReport: undefined,
  activeReportDetail: {
    blocks: [],
  },
  idToShow: undefined,
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
        activeReportDetail: action.payload,
      }
    }

    case REPORTING_MARK_REPORT_TO_SHOW: {
      return {
        ...state,
        idToShow: action.payload,
      }
    }

    case REPORTING_CLOSE:
      return initialState;

    default:
      return state;
  }
}
