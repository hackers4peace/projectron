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

export const userIdReceived = createAction(
  '[CORE] userId Received',
  props<{userId: string}>(),
)

export const incomingLoginRedirect = createAction(
  '[CORE] Incoming Login Redirect',
  props<{url: string}>(),
);

export const applicationRegistrationDiscovered = createAction(
  '[CORE] Application Registration Discovered',
  props<{applicationRegistrationIri: string}>(),
)

export const authorizationNeeded = createAction(
  '[CORE] Authorization Needed',
  props<{redirectIri: string}>(),
)
