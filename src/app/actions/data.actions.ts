import { createAction, props } from '@ngrx/store';
import { Project } from '../models/project.model';

export const loadProjects = createAction(
  '[Data] Load Projects',
  props<{ ownerId: string }>()
);

export const loadProjectsSuccess = createAction(
  '[Data] Load Projects Success',
  props<{ projects: Project[] }>()
);

export const loadProjectsFailure = createAction(
  '[Data] Load Projects Failure',
  props<{ error: any }>()
);
