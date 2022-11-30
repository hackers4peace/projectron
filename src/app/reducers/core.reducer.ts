import { Action, createReducer, on } from '@ngrx/store';
import { userIdReceived, applicationRegistrationDiscovered, authorizationRedirectUriDiscovered } from '../actions/core.actions';


export const coreFeatureKey = 'core';

export interface State {
  userId: string | null;
  isAuthorized: boolean;
  authorizationRedirectUri: string | null;
}

export const initialState: State = {
  userId: null,
  isAuthorized: false,
  authorizationRedirectUri: null,
};

export const reducer = createReducer(
  initialState,
  on(userIdReceived, (state, {userId}) => ({...state, userId})),
  on(applicationRegistrationDiscovered, (state) => ({...state, isAuthorized: true})),
  on(authorizationRedirectUriDiscovered, (state, {authorizationRedirectUri}) => ({...state, authorizationRedirectUri}))
);
