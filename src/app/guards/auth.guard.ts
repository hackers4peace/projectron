import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Store } from '@ngrx/store';
import { from, map, Observable, tap, withLatestFrom } from 'rxjs';
import { isAuthorized } from '../selectors/core.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router, private store: Store) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(this.tryToRecoverSession()).pipe(
      withLatestFrom(this.store.select(isAuthorized)),
      map(([recoveredLoggedIn, isAuthorized]) => {
        if (recoveredLoggedIn && isAuthorized) {
          return true;
        } else if (!recoveredLoggedIn) {
          return this.router.parseUrl('login');
        } else {
          return this.router.parseUrl('request-authorization');
        }
      })
    );
  }

  private async tryToRecoverSession(): Promise<boolean> {
    const session = getDefaultSession();

    if (!session.info.isLoggedIn) {
      // if session can be restored it will redirect to oidcIssuer, which will return back to `/redirect`
      await session.handleIncomingRedirect({ restorePreviousSession: true });
    }
    return session.info.isLoggedIn;
  }
}
