import { Action, createReducer, on } from '@ngrx/store';
import { loadProjectsSuccess } from '../actions/data.actions';
import { Project } from '../models/project.model';


export const dataFeatureKey = 'data';

export interface State {
  projects: {[ownerId: string]: Project[]};
}

export const initialState: State = {
  projects: {}
};

export const reducer = createReducer(
  initialState,
  on(loadProjectsSuccess, (state, {ownerId, projects}) => ({...state, projects: {...state.projects, [ownerId]: projects} })),
);
