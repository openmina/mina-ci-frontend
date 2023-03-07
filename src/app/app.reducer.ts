import { APP_TOGGLE_MOBILE } from '@app/app.actions';
import { AppState } from '@app/app.state';


const initialState: AppState = {
  menu: {
    isMobile: false,
  },
};

export function reducer(state: AppState = initialState, action: any): AppState {
  switch (action.type) {

    case APP_TOGGLE_MOBILE: {
      return {
        ...state,
        menu: {
          ...state.menu,
          isMobile: action.payload.isMobile,
        },
      };
    }

    default:
      return state;
  }
}
