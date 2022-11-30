import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { Store } from '@ngrx/store';
import { BehaviorSubject, filter, from, mergeMap, Observable, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { userId } from '../selectors/core.selector';

@Injectable({
  providedIn: 'root'
})
export class SaiService {
  private session: Application | undefined;

  async buildSession(userId: string): Promise<Application> {
    this.session = await Application.build(
      userId!,
      environment.applicationId,
      { fetch: getDefaultSession().fetch, randomUUID: self.crypto.randomUUID }
    );

    return this.session;
  }

  authorize(authorizationRedirectUri: string) {
    window.location.href = authorizationRedirectUri;
  }

    // this.session$ = store.select(userId).pipe(
    //   filter(userId => !!userId),
    //   take(1),
    //   mergeMap(userId => {
    //     return from(Application.build(
    //       userId!,
    //       environment.applicationId,
    //       { fetch: getDefaultSession().fetch, randomUUID: self.crypto.randomUUID }
    //     ))
    //   }),
    //   tap(session => {
    //     store.dispatch()
    //   })
}
