import { createReducer, on } from '@ngrx/store';
import { agentsKnown, deleteProjectSuccess, deleteTaskSuccess, loadFilesSuccess, loadImagesSuccess, loadProjectsSuccess, loadTasksSuccess, updateFileSuccess, updateImageSuccess, updateProjectSuccess, updateTaskSuccess } from '../actions/data.actions';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Agent } from '../models/agent.model';
import { Image } from '../models/image.model';
import { Registration } from '../models/registration.model';
import { FileInstance } from '../models/file.model';

export const dataFeatureKey = 'data';

export interface State {
  projects: {[ownerId: string]: Project[]};
  registrations: {[ownerId: string]: Registration[]};
  tasks: {[projectId: string]: Task[]};
  images: {[projectId: string]: Image[]};
  files: {[projectId: string]: FileInstance[]};
  agents: Agent[];
}

export const initialState: State = {
  projects: {},
  registrations: {},
  tasks: {},
  images: {},
  files: {},
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
  }),
  on(deleteTaskSuccess, (state, {task}) => {
    const oldTasks = state.tasks[task.project]
    const newTasks = oldTasks.filter(t => t.id !== task.id);
    return {...state, tasks: {...state.tasks, [task.project]: newTasks} }
  }),
  on(deleteProjectSuccess, (state, {project}) => {
    const oldProjects = state.projects[project.owner];
    const newProjects = oldProjects.filter(p => p.id !== project.id);
    return {...state, projects: {...state.projects, [project.owner]: newProjects} }
  }),

  on(loadImagesSuccess, (state, {projectId, images}) => ({...state, images: {...state.images, [projectId]: images} })),
  // TODO support updated besides add
  on(updateImageSuccess, (state, {image}) => {
    return {...state, images: {...state.images, [image.project]: [...state.images[image.project], image]} }
  }),
  
  on(loadFilesSuccess, (state, {projectId, files}) => ({...state, files: {...state.files, [projectId]: files} })),
   // TODO support updated besides add
  on(updateFileSuccess, (state, {file}) => {
    return {...state, files: {...state.files, [file.project]: [...state.files[file.project], file]} }
  }),
);
