import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loginRequested, webIdReceived, loginInitiated, incomingLoginRedirect } from '../actions/core.actions'
import { AuthnService } from '../services/authn.service';
import { map, mergeMap, tap } from "rxjs/operators";
import { from } from 'rxjs';

@Injectable()
export class CoreEffects {


  constructor(
    private actions$: Actions,
    private authn: AuthnService
    ) {}

  login$ = createEffect(() => this.actions$.pipe(
    ofType(loginRequested),
    map(({oidcIssuer}) => loginInitiated({oidcIssuer})),
    tap(({oidcIssuer}) => this.authn.login(oidcIssuer)),
  ))

  handleIncomingRedirect$ = createEffect(() => this.actions$.pipe(
    ofType(incomingLoginRedirect),
    mergeMap(({url}) => from(this.authn.handleRedirect(url))),
    map(oidcInfo => webIdReceived({webId: oidcInfo.webId!}))
  ))
}
