import { Action, createReducer, on } from '@ngrx/store';


export const coreFeatureKey = 'core';

export interface State {
  webid: string | null;
}

export const initialState: State = {
  webid: null,
};

export const reducer = createReducer(
  initialState,

);
