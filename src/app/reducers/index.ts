import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCore from './core.reducer';
import * as fromData from './data.reducer';

export interface State {

  [fromCore.coreFeatureKey]: fromCore.State;
  [fromData.dataFeatureKey]: fromData.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromCore.coreFeatureKey]: fromCore.reducer,
  [fromData.dataFeatureKey]: fromData.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
