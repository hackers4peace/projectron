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
  props<{isAuthorized: boolean}>(),
)

export const authorizationRedirectUriDiscovered = createAction(
  '[CORE] Authorization Redirect URI Discovered',
)

export const authorizationRequested = createAction(
  '[CORE] Authorization Requested',
)
