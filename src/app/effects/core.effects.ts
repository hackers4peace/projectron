import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { loginRequested, userIdReceived, loginInitiated, incomingLoginRedirect, applicationRegistrationDiscovered, authorizationRedirectUriDiscovered, authorizationRequested } from '../actions/core.actions'
import { AuthnService } from '../services/authn.service';
import { map, mergeMap, tap } from "rxjs/operators";
import { from } from 'rxjs';
import { SaiService } from '../services/sai.service';
import { EMPTY } from 'rxjs';
import { authorizationRedirectUri } from '../selectors/core.selector';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Injectable()
export class CoreEffects {
  constructor(
    private store: Store,
    private router: Router,
    private actions$: Actions,
    private authn: AuthnService,
    private sai: SaiService,
    ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginRequested),
    map(({oidcIssuer}) => loginInitiated({oidcIssuer})),
    tap(({oidcIssuer}) => this.authn.login(oidcIssuer)),
  ))

  handleIncomingRedirect$ = createEffect(() => this.actions$.pipe(
    ofType(incomingLoginRedirect),
    mergeMap(({url}) => from(this.authn.handleRedirect(url))),
    map(oidcInfo => userIdReceived({userId: oidcInfo.webId!}))
  ))

  buildSaiSession$ = createEffect(() => this.actions$.pipe(
    ofType(userIdReceived),
    mergeMap(({userId}) => from(this.sai.buildSession(userId))),
    map(session => {
      if(session.hasApplicationRegistration) {
        return applicationRegistrationDiscovered()
      } else if (session.authorizationRedirectUri) {
        return authorizationRedirectUriDiscovered({authorizationRedirectUri: session.authorizationRedirectUri})
      } else {
        throw new Error('Impossible to authorize!')
      }
    })
  ))

  naviagateToRequestAuthorization$ = createEffect(() => this.actions$.pipe(
    ofType(authorizationRedirectUriDiscovered),
    tap(() => this.router.navigateByUrl('/request-authorization'))
  ), {dispatch: false});

  naviagateToDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(applicationRegistrationDiscovered),
    tap(() => this.router.navigateByUrl('/dashboard'))
  ), {dispatch: false});

  requestAuthorization$ = createEffect(() => this.actions$.pipe(
    ofType(authorizationRequested),
    mergeMap(() => this.store.select(authorizationRedirectUri)),
    tap(authorizationRedirectUri => this.sai.authorize(authorizationRedirectUri!))
  ), {dispatch: false});
}
