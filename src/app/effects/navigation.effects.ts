import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { applicationRegistrationDiscovered, authorizationRedirectUriDiscovered } from '../actions/core.actions'
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { updateProjectSuccess, updateTaskSuccess } from '../actions/data.actions';
import { userId as selectUserId } from '../selectors/core.selector';
import { Store } from '@ngrx/store';

@Injectable()
export class NavigationEffects {
  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
  ) {}

  naviagateToRequestAuthorization$ = createEffect(() => this.actions$.pipe(
    ofType(authorizationRedirectUriDiscovered),
    tap(() => this.router.navigateByUrl('/request-authorization'))
  ), {dispatch: false});

  naviagateToDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(applicationRegistrationDiscovered),
    concatLatestFrom(() => this.store.select(selectUserId)),
    tap(([action, userId]) => this.router.navigateByUrl(`/?agentId=${encodeURIComponent(userId!)}`))
  ), {dispatch: false});


  naviagateBackToProject$ = createEffect(() => this.actions$.pipe(
    ofType(updateProjectSuccess),
    tap(({ project }) => this.router.navigateByUrl(`/project?projectId=${encodeURIComponent(project.id!)}&agentId=${encodeURIComponent(project.owner!)}`))
  ), {dispatch: false});

  naviagateBackToProjectFromTask$ = createEffect(() => this.actions$.pipe(
    ofType(updateTaskSuccess),
    tap(({ task }) => this.router.navigateByUrl(`/project?projectId=${encodeURIComponent(task.project!)}&agentId=${encodeURIComponent(task.owner!)}`))
  ), {dispatch: false});

}
