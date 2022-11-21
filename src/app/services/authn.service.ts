import { Injectable } from '@angular/core';
import type { ISessionInfo } from '@inrupt/solid-client-authn-browser';
import { environment } from "../../environments/environment";
import { SolidOidc } from '../utils/solid-oidc';

class OidcError extends Error {
  constructor(private oidcInfo?: ISessionInfo) {
     super('oidcInfo');
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthnService {

  constructor(
    private solidOidc: SolidOidc,
  ) {}

  async login(oidcIssuer: string) {

    await this.solidOidc.login({
      clientId: environment.clientId,
      oidcIssuer,
      redirectUrl: `${environment.baseUrl}/redirect`,
    });
  }

  async handleRedirect(url: string): Promise<ISessionInfo> {
    const oidcInfo = await this.solidOidc.handleIncomingRedirect(url);
    if (oidcInfo?.webId) {
      return oidcInfo;
    } else {
      throw new OidcError(oidcInfo);
    }
  }
}
