import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { applicationRegistrationDiscovered } from '../actions/core.actions';
import { agentsKnown, deleteImage, deleteImageFailure, deleteImageSuccess, deleteProject, deleteProjectFailure, deleteProjectSuccess, deleteTask, deleteTaskFailure, deleteTaskSuccess, loadFiles, loadFilesFailure, loadFilesSuccess, loadImages, loadImagesFailure, loadImagesSuccess, loadProjects, loadProjectsFailure, loadProjectsSuccess, loadTasks, loadTasksFailure, loadTasksSuccess, shareProject, updateFile, updateFileFailure, updateFileSuccess, updateImage, updateImageFailure, updateImageSuccess, updateProject, updateProjectFailure, updateProjectSuccess, updateTask, updateTaskFailure, updateTaskSuccess } from '../actions/data.actions';
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

  deleteTask$ = createEffect(() => this.actions$.pipe(
    ofType(deleteTask),
    switchMap(({ task }) => from(this.sai.deleteTask(task))),
    map(task => deleteTaskSuccess({ task })),
    catchError(error => of(deleteTaskFailure({error: { name: error.name, message: error.message}})))
  ))

  deleteProject$ = createEffect(() => this.actions$.pipe(
    ofType(deleteProject),
    switchMap(({ project }) => from(this.sai.deleteProject(project))),
    map(project => deleteProjectSuccess({ project })),
    catchError(error => of(deleteProjectFailure({error: { name: error.name, message: error.message}})))
  ))

  shareProject$ = createEffect(() => this.actions$.pipe(
    ofType(shareProject),
    tap(({project}) => this.sai.share(project))
  ), {dispatch: false});

  loadImages$ = createEffect(() => this.actions$.pipe(
    ofType(loadImages),
    switchMap(({projectId}) => from(this.sai.loadImages(projectId))),
    map(data => loadImagesSuccess(data)),
    catchError(error => of(loadImagesFailure({error: { name: error.name, message: error.message}})))
  ))

  updateImage$ = createEffect(() => this.actions$.pipe(
    ofType(updateImage),
    switchMap(({ image, file }) => from(this.sai.updateImage(image, file))), // TODO rename file to blob
    map(image => updateImageSuccess({ image })),
    catchError(error => of(updateImageFailure({error: { name: error.name, message: error.message}})))
  ))

  // deleteImage$ = createEffect(() => this.actions$.pipe(
  //   ofType(deleteImage),
  //   switchMap(({ image }) => from(this.sai.deleteImage(image))),
  //   map(image => deleteImageSuccess({ image })),
  //   catchError(error => of(deleteImageFailure({error: { name: error.name, message: error.message}})))
  // ))

  loadFiles$ = createEffect(() => this.actions$.pipe(
    ofType(loadFiles),
    switchMap(({projectId}) => from(this.sai.loadFiles(projectId))),
    map(data => loadFilesSuccess(data)),
    catchError(error => of(loadFilesFailure({error: { name: error.name, message: error.message}})))
  ))

  updateFile$ = createEffect(() => this.actions$.pipe(
    ofType(updateFile),
    switchMap(({ file, blob }) => from(this.sai.updateFile(file, blob))),
    map(file => updateFileSuccess({ file })),
    catchError(error => of(updateFileFailure({error: { name: error.name, message: error.message}})))
  ))

}
