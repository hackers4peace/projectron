import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { applicationRegistrationDiscovered } from '../actions/core.actions';
import { agentsKnown, loadProjects, loadProjectsFailure, loadProjectsSuccess, loadTasks, loadTasksFailure, loadTasksSuccess, updateProject, updateProjectFailure, updateProjectSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from '../actions/data.actions';
import { SaiService } from '../services/sai.service';



@Injectable()
export class DataEffects {


  constructor(
    private actions$: Actions,
    private sai: SaiService,
    private store: Store,
    ) {}

  getAgents$ = createEffect(() => this.actions$.pipe(
    ofType(applicationRegistrationDiscovered),
    switchMap(() => from(this.sai.getAgents())),
    map(agents => agentsKnown({ agents } ))
  ))

  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(loadProjects),
    switchMap(({ownerId}) => from(this.sai.loadProjects(ownerId))),
    map(data => loadProjectsSuccess(data)),
    catchError(error => of(loadProjectsFailure({error: { name: error.name, message: error.message}})))
  ))

  updateProject$ = createEffect(() => this.actions$.pipe(
    ofType(updateProject),
    switchMap(({ project }) => from(this.sai.updateProject(project))),
    map(project => updateProjectSuccess({ project })),
    catchError(error => of(updateProjectFailure({error: { name: error.name, message: error.message}})))
  ))
  
  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(loadTasks),
    switchMap(({projectId}) => from(this.sai.loadTasks(projectId))),
    map(data => loadTasksSuccess(data)),
    catchError(error => of(loadTasksFailure({error: { name: error.name, message: error.message}})))
  ))

  updateTask$ = createEffect(() => this.actions$.pipe(
    ofType(updateTask),
    switchMap(({ task }) => from(this.sai.updateTask(task))),
    map(task => updateTaskSuccess({ task })),
    catchError(error => of(updateTaskFailure({error: { name: error.name, message: error.message}})))
  ))
}
