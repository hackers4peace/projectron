import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, from, map, mergeMap, of, switchMap } from 'rxjs';
import { loadMyProjects, loadProjects, loadProjectsFailure, loadProjectsSuccess } from '../actions/data.actions';
import { userId } from '../selectors/core.selector';
import { SaiService } from '../services/sai.service';



@Injectable()
export class DataEffects {


  constructor(
    private actions$: Actions,
    private sai: SaiService,
    private store: Store,
    ) {}

  loadProjects$ = createEffect(() => this.actions$.pipe(
    ofType(loadProjects),
    switchMap(({ownerId}) => from(this.sai.loadProjects(ownerId))),
    map(data => loadProjectsSuccess(data)),
    catchError(error => of(loadProjectsFailure({error})))
  ))

  loadMyProjects$ = createEffect(() => this.actions$.pipe(
    ofType(loadMyProjects),
    switchMap(() => this.store.select(userId)),
    filter(ownerId => !!ownerId),
    map(ownerId => loadProjects({ownerId: ownerId!}))
  ))
}
