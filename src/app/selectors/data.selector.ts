
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {dataFeatureKey, State} from "../reducers/data.reducer";
import { userId } from "./core.selector";

export const selectData = createFeatureSelector<State>(dataFeatureKey);

export const selectAgent = (id: string) =>
  createSelector(
    selectData,
    data => data.agents.find(agent => agent.id === id)!
  )

export const selectAgents = createSelector(
  selectData,
  data => data.agents
)

export const selectProject = (id: string) =>
  createSelector(
    selectData,
    data => Object.values(data.projects).flat().find(project => project.id === id)!
  )

export const selectTasks = (projectId: string) =>
  createSelector(
    selectData,
    data => data.tasks[projectId]
  )

export const selectTask = (id: string) =>
  createSelector(
    selectData,
    data => Object.values(data.tasks).flat().find(task => task.id === id)!
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

export const selectProjects = (ownerId: string) =>
  createSelector(
    selectData,
    data => data.projects[ownerId]
  )