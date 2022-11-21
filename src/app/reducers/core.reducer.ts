import { Action, createReducer, on } from '@ngrx/store';
import { userIdReceived } from '../actions/core.actions';


export const coreFeatureKey = 'core';

export interface State {
  userId: string | null;
}

export const initialState: State = {
  userId: null,
};

export const reducer = createReducer(
  initialState,
  on(userIdReceived, (state, {userId}) => ({...state, userId})),
);
