import { Injectable } from "@angular/core";
import { handleIncomingRedirect, login } from "@inrupt/solid-client-authn-browser";

@Injectable({
  providedIn: 'root'
})
export class SolidOidc {
  login = login
  handleIncomingRedirect = handleIncomingRedirect
}
