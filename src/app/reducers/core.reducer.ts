import { createReducer, on } from '@ngrx/store';
import { userIdReceived, applicationRegistrationDiscovered } from '../actions/core.actions';


export const coreFeatureKey = 'core';

export interface State {
  userId: string | null;
  isAuthorized: boolean;
}

export const initialState: State = {
  userId: null,
  isAuthorized: false,
};

export const reducer = createReducer(
  initialState,
  on(userIdReceived, (state, {userId}) => ({...state, userId})),
  on(applicationRegistrationDiscovered, (state, {isAuthorized}) => ({...state, isAuthorized})),
);
