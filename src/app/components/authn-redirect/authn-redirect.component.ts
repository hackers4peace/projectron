import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { incomingLoginRedirect } from 'src/app/actions/core.actions';

@Component({
  selector: 'app-authn-redirect',
  templateUrl: './authn-redirect.component.html',
  styleUrls: ['./authn-redirect.component.css']
})
export class AuthnRedirectComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(incomingLoginRedirect({url: window.location.href}));
  }
}
