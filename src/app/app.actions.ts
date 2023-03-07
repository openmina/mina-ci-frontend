import { FeatureAction } from '@shared/types/store/feature-action.type';

enum AppActionTypes {
  APP_TOGGLE_MOBILE = 'APP_TOGGLE_MOBILE',
}

export const APP_TOGGLE_MOBILE = AppActionTypes.APP_TOGGLE_MOBILE;

export interface AppAction extends FeatureAction<AppActionTypes> {
  readonly type: AppActionTypes;
}

export class AppToggleMobile implements AppAction {
  readonly type = APP_TOGGLE_MOBILE;

  constructor(public payload: { isMobile: boolean }) { }
}

export type AppActions =
  | AppToggleMobile
  ;
