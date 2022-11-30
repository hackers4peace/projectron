import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { authorizationRequested } from 'src/app/actions/core.actions';

@Component({
  selector: 'app-request-authorization',
  templateUrl: './request-authorization.component.html',
  styleUrls: ['./request-authorization.component.css']
})
export class RequestAuthorizationComponent implements OnInit {

  requestAuthorization() {
    this.store.dispatch(authorizationRequested())
  }

  constructor(private store: Store) {}

  ngOnInit(): void {
  }

}
