
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {coreFeatureKey, State} from "../reducers/core.reducer";

export const selectCore = createFeatureSelector<State>(coreFeatureKey);

export const userId = createSelector(
  selectCore,
  core => core.userId,
);
