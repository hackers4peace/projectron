import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { loadProjects, loadProjectsFailure, loadProjectsSuccess } from '../actions/data.actions';
import { SaiService } from '../services/sai.service';



@Injectable()
export class DataEffects {


  constructor(
    private actions$: Actions,
    private sai: SaiService,
    ) {}

  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(loadProjects),
    switchMap(({ownerId}) => from(this.sai.loadProjects(ownerId))),
    map(projects => loadProjectsSuccess({projects})),
    catchError(error => of(loadProjectsFailure({error})))
  ))
}
