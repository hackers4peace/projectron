import { createAction, props } from '@ngrx/store';
import { Agent } from '../models/agent.model';
import { Project } from '../models/project.model';
import { Registration } from '../models/registration.model';
import { Task } from '../models/task.model';

export const agentsKnown = createAction(
  '[Data] Agents Known',
  props<{ agents: Agent[] }>()
)

export const loadProjects = createAction(
  '[Data] Load Projects',
  props<{ ownerId: string }>()
);

export const loadProjectsSuccess = createAction(
  '[Data] Load Projects Success',
  props<{ ownerId: string, projects: Project[], registrations: Registration[] }>()
);

export const loadProjectsFailure = createAction(
  '[Data] Load Projects Failure',
  props<{ error: any }>()
);

export const updateProject = createAction(
  '[Data] Update Project',
  props<{ project: Project }>()
)

export const updateProjectSuccess = createAction(
  '[Data] Update Project Success',
  props<{ project: Project }>()
)

export const updateProjectFailure = createAction(
  '[Data] Update Project Failure',
  props<{ error: any }>()
)

export const loadTasks = createAction(
  '[Data] Load Tasks',
  props<{ projectId: string }>()
);

export const loadTasksSuccess = createAction(
  '[Data] Load Tasks Success',
  props<{ projectId: string, tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Data] Load Tasks Failure',
  props<{ error: any }>()
);

export const updateTask = createAction(
  '[Data] Update Task',
  props<{ task: Task }>()
)

export const updateTaskSuccess = createAction(
  '[Data] Update Task Success',
  props<{ task: Task }>()
)

export const updateTaskFailure = createAction(
  '[Data] Update Task Failure',
  props<{ error: any }>()
)

export const deleteTask = createAction(
  '[Data] Delete Task',
  props<{ task: Task }>()
)

export const deleteTaskSuccess = createAction(
  '[Data] Delete Task Success',
  props<{ task: Task }>()
)

export const deleteTaskFailure = createAction(
  '[Data] Delete Task Failure',
  props<{ error: any }>()
)

export const deleteProject = createAction(
  '[Data] Delete Project',
  props<{ project: Project }>()
)

export const deleteProjectSuccess = createAction(
  '[Data] Delete Project Success',
  props<{ project: Project }>()
)

export const deleteProjectFailure = createAction(
  '[Data] Delete Project Failure',
  props<{ error: any }>()
)
