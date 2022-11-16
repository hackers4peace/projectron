import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromCore from './core.reducer';


export interface State {

  [fromCore.coreFeatureKey]: fromCore.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromCore.coreFeatureKey]: fromCore.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
