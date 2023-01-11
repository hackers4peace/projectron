import { createReducer, on } from '@ngrx/store';
import { agentsKnown, loadProjectsSuccess, loadTasksSuccess, updateProjectSuccess, updateTaskSuccess } from '../actions/data.actions';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Agent } from '../models/agent.model';
import { Registration } from '../models/registration.model';


export const dataFeatureKey = 'data';

export interface State {
  projects: {[ownerId: string]: Project[]};
  registrations: {[ownerId: string]: Registration[]};
  tasks: {[projectId: string]: Task[]};
  agents: Agent[];
}

export const initialState: State = {
  projects: {},
  registrations: {},
  tasks: {},
  agents: []
};

export const reducer = createReducer(
  initialState,
  on(agentsKnown, (state, { agents }) => ({...state, agents })),
  on(loadProjectsSuccess, (state, {ownerId, projects, registrations}) => ({
    ...state,
    projects: {...state.projects, [ownerId]: projects},
    registrations: {...state.registrations, [ownerId]: registrations}
  })),
  on(updateProjectSuccess, (state, {project}) => {
    const oldProjects = state.projects[project.owner]
    const index = oldProjects.findIndex(element => element.id === project.id)
    const newProjects = [...oldProjects]
    newProjects[index] = project
    return {...state, projects: {...state.projects, [project.owner]: newProjects} }
  }),
  on(loadTasksSuccess, (state, {projectId, tasks}) => ({...state, tasks: {...state.tasks, [projectId]: tasks} })),
  on(updateTaskSuccess, (state, {task}) => {
    const oldTasks = state.tasks[task.project]
    const index = oldTasks.findIndex(element => element.id === task.id)
    const newTasks = [...oldTasks]
    newTasks[index] = task
    return {...state, tasks: {...state.tasks, [task.project]: newTasks} }
  })
);
