import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginRequested, userIdReceived, loginInitiated, incomingLoginRedirect, applicationRegistrationDiscovered, authorizationRedirectUriDiscovered, authorizationRequested } from '../actions/core.actions'
import { AuthnService } from '../services/authn.service';
import { map, mergeMap, tap } from "rxjs/operators";
import { from } from 'rxjs';
import { SaiService } from '../services/sai.service';
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
        return applicationRegistrationDiscovered({isAuthorized: !!session.hasApplicationRegistration.hasAccessGrant.granted})
      } else if (session.authorizationRedirectUri) {
        return authorizationRedirectUriDiscovered()
      } else {
        throw new Error('Impossible to authorize!')
      }
    })
  ))

  requestAuthorization$ = createEffect(() => this.actions$.pipe(
    ofType(authorizationRequested),
    tap(() => this.sai.authorize())
  ), {dispatch: false});
}
