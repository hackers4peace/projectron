
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {dataFeatureKey, State} from "../reducers/data.reducer";
import { userId } from "./core.selector";
import { Project } from "../models/project.model";

export const selectData = createFeatureSelector<State>(dataFeatureKey);

export const selectProjects = createSelector(
  selectData,
  data => data.projects
)

export const selectProject = (id: string) =>
  createSelector(
    selectData,
    data => Object.values(data.projects).flat().find(project => project.id === id)!
  )

export const selectProjectsForOwner = (ownerId: string) =>
  createSelector(
    selectData,
    data => data.projects[ownerId] ?? []
  )

export const selectMyProjects = createSelector(
  userId,
  selectData,
  (ownerId, data) => ownerId ? data.projects[ownerId] ?? [] : []
)
