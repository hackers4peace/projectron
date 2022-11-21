import { Action, createReducer, on } from '@ngrx/store';
import { webIdReceived } from '../actions/core.actions';


export const coreFeatureKey = 'core';

export interface State {
  webId: string | null;
}

export const initialState: State = {
  webId: null,
};

export const reducer = createReducer(
  initialState,
  on(webIdReceived, (state, {webId}) => ({...state, webId})),
);
