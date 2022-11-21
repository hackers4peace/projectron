import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Store } from "@ngrx/store";
import { loginRequested } from 'src/app/actions/core.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  defaultOidcIssuer = environment.defaultOidcIssuer

  loginForm = new UntypedFormGroup({
    issuer: new UntypedFormControl(''),
  })

  constructor(
    private store: Store,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const oidcIssuer = this.loginForm.get('issuer')!.value || this.defaultOidcIssuer
    this.store.dispatch(loginRequested({ oidcIssuer }));
  }
}
