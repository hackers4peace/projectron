import type { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { createAction, props } from '@ngrx/store';

export const loginRequested = createAction(
  '[CORE] Login Requested',
  props<{oidcIssuer: string}>(),
);

export const loginInitiated = createAction(
  '[CORE] Login Initiated',
   props<{oidcIssuer: string}>(),
);

export const webIdReceived = createAction(
  '[CORE] WebId Received',
  props<{webId: string}>(),
)

export const incomingLoginRedirect = createAction(
  '[CORE] Incoming Login Redirect',
  props<{url: string}>(),
);
