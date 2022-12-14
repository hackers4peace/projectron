import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { applicationRegistrationDiscovered, authorizationRedirectUriDiscovered } from '../actions/core.actions'
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { updateProjectSuccess } from '../actions/data.actions';

@Injectable()
export class NavigationEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
  ) {}

  naviagateToRequestAuthorization$ = createEffect(() => this.actions$.pipe(
    ofType(authorizationRedirectUriDiscovered),
    tap(() => this.router.navigateByUrl('/request-authorization'))
  ), {dispatch: false});

  naviagateToDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(applicationRegistrationDiscovered),
    tap(() => this.router.navigateByUrl('/dashboard'))
  ), {dispatch: false});


  naviagateBackToProject$ = createEffect(() => this.actions$.pipe(
    ofType(updateProjectSuccess),
    tap(({ project }) => this.router.navigateByUrl(`/project?id=${project.id}`))
  ), {dispatch: false});

}
