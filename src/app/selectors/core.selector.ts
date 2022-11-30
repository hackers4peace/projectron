
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {coreFeatureKey, State} from "../reducers/core.reducer";

export const selectCore = createFeatureSelector<State>(coreFeatureKey);

export const userId = createSelector(
  selectCore,
  core => core.userId,
);

export const isAuthorized = createSelector(
  selectCore,
  core => core.isAuthorized,
);

export const authorizationRedirectUri = createSelector(
  selectCore,
  core => core.authorizationRedirectUri,
)
